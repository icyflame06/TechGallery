import os
import sys
from pathlib import Path

# Add backend directory to sys.path so app imports work seamlessly on Vercel
current_dir = Path(__file__).resolve().parent
root_dir = current_dir.parent
backend_dir = root_dir / "backend"

for p in [str(backend_dir), str(root_dir)]:
    if p not in sys.path:
        sys.path.insert(0, p)

from app.main import app
