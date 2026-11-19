import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool
from app.config import settings

logger = logging.getLogger("techgallery.database")
is_serverless = bool(os.environ.get("VERCEL") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME"))

# Normalize database URL
db_url = settings.DATABASE_URL
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql+psycopg2://", 1)
elif db_url.startswith("postgresql://") and not db_url.startswith("postgresql+"):
    db_url = db_url.replace("postgresql://", "postgresql+psycopg2://", 1)

# Ensure transaction pooler port 6543 for Supabase in serverless (port 5432 is session mode with IPv6/timeouts)
if "pooler.supabase.com:5432" in db_url:
    db_url = db_url.replace("pooler.supabase.com:5432", "pooler.supabase.com:6543")

# Ensure sslmode=require for Supabase cloud PostgreSQL
if "supabase" in db_url and "sslmode" not in db_url:
    delimiter = "&" if "?" in db_url else "?"
    db_url = f"{db_url}{delimiter}sslmode=require"

# Handle sqlite on Vercel / serverless (read-only filesystem, use /tmp)
if is_serverless and db_url.startswith("sqlite"):
    if ":memory:" not in db_url and not db_url.startswith("sqlite:////tmp"):
        db_url = "sqlite:////tmp/techgallery.db"

connect_args = {}
engine_kwargs = {
    "pool_pre_ping": True,
}

if db_url.startswith("sqlite"):
    connect_args["check_same_thread"] = False
    engine_kwargs["connect_args"] = connect_args
else:
    connect_args["connect_timeout"] = 3
    engine_kwargs["connect_args"] = connect_args
    if is_serverless:
        engine_kwargs["poolclass"] = NullPool
    else:
        engine_kwargs["pool_recycle"] = 300

def create_sqlite_engine():
    fallback_url = "sqlite:////tmp/techgallery.db" if is_serverless else "sqlite:///./techgallery.db"
    return create_engine(
        fallback_url,
        connect_args={"check_same_thread": False},
        pool_pre_ping=True
    )

def is_host_resolvable(url: str, timeout: float = 1.0) -> bool:
    try:
        from urllib.parse import urlparse
        import socket
        parsed = urlparse(url)
        hostname = parsed.hostname
        if not hostname or hostname in ("localhost", "127.0.0.1", "::1"):
            return True
        orig_timeout = socket.getdefaulttimeout()
        socket.setdefaulttimeout(timeout)
        try:
            socket.gethostbyname(hostname)
            return True
        finally:
            socket.setdefaulttimeout(orig_timeout)
    except Exception:
        return False

def init_engine():
    if db_url.startswith("sqlite"):
        return create_sqlite_engine()
    if not is_host_resolvable(db_url, timeout=1.0):
        logger.warning(f"Database host for '{db_url}' is not resolvable. Using resilient SQLite fallback.")
        return create_sqlite_engine()
    try:
        eng = create_engine(db_url, **engine_kwargs)
        with eng.connect() as conn:
            pass
        logger.info("Connected to primary PostgreSQL database.")
        return eng
    except Exception as e:
        logger.warning(f"Primary PostgreSQL database unreachable ({e}). Using resilient SQLite fallback.")
        return create_sqlite_engine()

engine = init_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

_initialized = False

def migrate_columns(target_engine):
    try:
        from sqlalchemy import inspect, text
        inspector = inspect(target_engine)
        if "registrations" in inspector.get_table_names():
            columns = [c["name"] for c in inspector.get_columns("registrations")]
            if "roll_number" not in columns:
                logger.info("Migrating schema: adding roll_number to registrations table")
                with target_engine.begin() as conn:
                    conn.execute(text("ALTER TABLE registrations ADD COLUMN roll_number VARCHAR(50);"))
    except Exception as e:
        logger.warning(f"Schema column migration notice: {e}")

def ensure_tables():
    global _initialized, engine, SessionLocal
    if not _initialized:
        try:
            Base.metadata.create_all(bind=engine)
            migrate_columns(engine)
            db = SessionLocal()
            try:
                from app.seed_data import seed_database
                seed_database(db)
            finally:
                db.close()
            _initialized = True
            logger.info("Database initialized and seeded successfully.")
        except Exception as e:
            logger.warning(f"Initial ensure_tables error: {e}. Re-binding to SQLite fallback.")
            try:
                engine = create_sqlite_engine()
                SessionLocal.configure(bind=engine)
                Base.metadata.create_all(bind=engine)
                migrate_columns(engine)
                db = SessionLocal()
                try:
                    from app.seed_data import seed_database
                    seed_database(db)
                finally:
                    db.close()
                _initialized = True
                logger.info("SQLite fallback successfully initialized and seeded.")
            except Exception as e2:
                logger.error(f"Critical database initialization error: {e2}")

def get_db():
    if not _initialized:
        ensure_tables()
    db = SessionLocal()
    try:
        yield db
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
