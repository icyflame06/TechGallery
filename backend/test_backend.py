import os
import sys

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app
from app.database import engine, Base, SessionLocal
from app.seed_data import seed_database
from app.config import settings

def run_tests():
    print("=== TECH GALLERY 2027: BACKEND TEST SUITE ===")
    
    # 1. Initialize schema & seed
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    seed_database(db)
    db.close()
    print("[OK] Database schema & seed data initialized.")

    client = TestClient(app)

    # 2. Test Root & Health
    r = client.get("/")
    assert r.status_code == 200, f"Root failed: {r.text}"
    assert r.json()["festival"] == "TECH GALLERY 2027"
    print("[OK] Root endpoint verified.")

    # 3. Test Events (Must have exactly the 8 official event schedule items)
    r = client.get("/api/events")
    assert r.status_code == 200, f"Get events failed: {r.text}"
    events = r.json()
    assert len(events) == 8, f"Expected 8 events, got {len(events)}"
    event_ids = [e["id"] for e in events]
    expected_ids = [
        "bhavesh-workshop",
        "thakkar-workshop",
        "bhavesh-hackathon",
        "tech-showcase-day-1",
        "tech-showcase-day-2",
        "thakkar-hackathon",
        "ai-workshop-parents",
        "both-hackathon-results",
    ]
    for eid in expected_ids:
        assert eid in event_ids, f"Missing event: {eid}"
    print(f"[OK] All 8 official festival events verified in database: {event_ids}")

    # 4. Test Registration Eligibility Restrictions
    # 4a. External student attempting to register for Bhavesh Workshop -> MUST BE REJECTED (400)
    external_attempt = {
        "full_name": "External Student",
        "email": "external@othercollege.edu",
        "phone": "+919876543210",
        "college_name": "Other State University",
        "department": "Computer Science",
        "year_semester": "3rd Year",
        "event_id": "bhavesh-workshop",
    }
    r = client.post("/api/registrations", json=external_attempt)
    assert r.status_code == 400, f"Expected 400 for external student on internal workshop, got {r.status_code}"
    print("[OK] External student blocked from internal Bhavesh Workshop (HTTP 400).")

    # 4b. External student attempting to register for Bhavesh Hackathon -> MUST BE REJECTED (400)
    hackathon_attempt = {
        "full_name": "External Hacker",
        "email": "hacker@othercollege.edu",
        "phone": "+919876543211",
        "college_name": "Other State University",
        "department": "Computer Science",
        "year_semester": "3rd Year",
        "event_id": "bhavesh-hackathon",
        "team_name": "ExternalHacks",
    }
    r = client.post("/api/registrations", json=hackathon_attempt)
    assert r.status_code == 400, f"Expected 400 for external student on hackathon, got {r.status_code}"
    print("[OK] External student blocked from internal Bhavesh Hackathon (HTTP 400).")

    # 4c. Valid Internal Student Registration for Bhavesh Workshop -> MUST SUCCEED (201)
    import time
    timestamp = int(time.time())
    internal_valid = {
        "full_name": "Harshil Student",
        "email": f"harshil_{timestamp}@techgallery2027.edu",
        "phone": f"+9198{str(timestamp)[-8:]}",
        "college_name": settings.OUR_COLLEGE_NAME,
        "department": "Computer Science & Engineering",
        "year_semester": "3rd Year / Semester 5",
        "event_id": "bhavesh-workshop",
    }
    r = client.post("/api/registrations", json=internal_valid)
    assert r.status_code == 201, f"Expected 201 for valid internal registration, got {r.status_code}: {r.text}"
    reg_record = r.json()
    assert reg_record["reg_code"].startswith("TG27-REG-")
    assert reg_record["is_internal"] is True
    print(f"[OK] Internal student successfully registered: Code {reg_record['reg_code']}")

    # 4d. Duplicate Registration check (Same email for same event) -> MUST FAIL (409 Conflict)
    r = client.post("/api/registrations", json=internal_valid)
    assert r.status_code == 409, f"Expected 409 Conflict for duplicate email, got {r.status_code}"
    print("[OK] Duplicate registration prevented for same event (HTTP 409 Conflict).")

    # 4e. Duplicate Registration check (Same phone for same event with different email) -> MUST FAIL (409 Conflict)
    dup_phone = internal_valid.copy()
    dup_phone["email"] = "other_email@techgallery2027.edu"
    r = client.post("/api/registrations", json=dup_phone)
    assert r.status_code == 409, f"Expected 409 Conflict for duplicate phone, got {r.status_code}"
    print("[OK] Duplicate phone registration prevented for same event (HTTP 409 Conflict).")

    # 4f. External student registering for Tech Showcase Day 1 -> MUST SUCCEED (201)
    showcase_reg = {
        "full_name": "Priya External",
        "email": f"priya_{timestamp}@nationaltech.edu",
        "phone": f"+9197{str(timestamp)[-8:]}",
        "college_name": "National Institute of Technology",
        "department": "Electronics & Robotics",
        "year_semester": "Final Year",
        "event_id": "tech-showcase-day-1",
    }
    r = client.post("/api/registrations", json=showcase_reg)
    assert r.status_code == 201, f"Expected 201 for external showcase registration, got {r.status_code}: {r.text}"
    print("[OK] External student successfully registered for Tech Showcase Day 1.")

    # 4g. External student registering for Tech Showcase Day 2 -> MUST SUCCEED (201)
    showcase_day2_reg = {
        "full_name": "Amit External",
        "email": f"amit_{timestamp}@nationaltech.edu",
        "phone": f"+9196{str(timestamp)[-8:]}",
        "college_name": "National Institute of Technology",
        "department": "Computer Science",
        "year_semester": "3rd Year",
        "event_id": "tech-showcase-day-2",
    }
    r = client.post("/api/registrations", json=showcase_day2_reg)
    assert r.status_code == 201, f"Expected 201 for external showcase day 2 registration, got {r.status_code}: {r.text}"
    print("[OK] External student successfully registered for Tech Showcase Day 2.")

    # 4h. External student attempting to register for Parents Workshop -> MUST BE REJECTED (400)
    parents_workshop_attempt = {
        "full_name": "External Parent Or Student",
        "email": f"ext_parent_{timestamp}@othercollege.edu",
        "phone": f"+9195{str(timestamp)[-8:]}",
        "college_name": "Other College",
        "department": "Arts",
        "year_semester": "1st Year",
        "event_id": "ai-workshop-parents",
    }
    r = client.post("/api/registrations", json=parents_workshop_attempt)
    assert r.status_code == 400, f"Expected 400 for external student on non-showcase event, got {r.status_code}"
    print("[OK] External student blocked from non-showcase event (HTTP 400).")

    # 5. Test Project Submission (Hardware & Software)
    # 5a. Submit Hardware Project
    hw_project = {
        "student_name": "Alex Kumar",
        "college_name": "National Tech University",
        "email": "alex@ntu.edu",
        "phone": "+919811122233",
        "project_name": "Autonomous Drone with LiDAR",
        "category": "Hardware",
        "sub_category": "Robotics",
        "description": "Custom 4-rotor drone with obstacle avoidance using ESP32 and micro-LiDAR sensor.",
        "technologies_used": "ESP32, C++, FreeRTOS, Micro-LiDAR",
        "num_team_members": 3,
        "team_member_names": "Alex Kumar, Rahul Verma, Sneha Sen",
        "demo_video_url": "https://youtube.com/watch?v=sample-demo",
        "images": ["https://images.unsplash.com/photo-1527977966376-1c8408f9f108"],
    }
    r = client.post("/api/projects", json=hw_project)
    assert r.status_code == 201, f"Project submission failed: {r.text}"
    hw_record = r.json()
    assert hw_record["project_code"].startswith("TG27-PRJ-")
    assert hw_record["status"] == "pending"
    print(f"[OK] Hardware project submitted: {hw_record['project_code']} (Status: pending)")

    # 5b. Submit Software Project
    sw_project = {
        "student_name": "Kavita Rao",
        "college_name": settings.OUR_COLLEGE_NAME,
        "email": "kavita@techgallery2027.edu",
        "phone": "+919844455566",
        "project_name": "Smart Campus Energy Optimizer",
        "category": "Software",
        "sub_category": "Artificial Intelligence",
        "description": "Reinforcement learning model optimizing campus HVAC and power grid consumption.",
        "technologies_used": "Python, PyTorch, FastAPI, React",
        "num_team_members": 2,
        "team_member_names": "Kavita Rao, Amit Patel",
        "demo_video_url": "https://youtube.com/watch?v=energy-demo",
    }
    r = client.post("/api/projects", json=sw_project)
    assert r.status_code == 201, f"Project submission failed: {r.text}"
    sw_record = r.json()
    print(f"[OK] Software project submitted: {sw_record['project_code']} (Status: pending)")

    # 6. Test Admin Authentication & Capabilities
    # 6a. Login
    login_data = {
        "email": settings.ADMIN_EMAIL,
        "password": settings.ADMIN_PASSWORD,
    }
    r = client.post("/api/admin/login", json=login_data)
    assert r.status_code == 200, f"Admin login failed: {r.text}"
    token_info = r.json()
    token = token_info["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print(f"[OK] Admin authenticated. Role: {token_info['role']}")

    # 6b. Stats
    r = client.get("/api/admin/stats", headers=headers)
    assert r.status_code == 200, f"Admin stats failed: {r.text}"
    stats = r.json()
    assert stats["total_registrations"] >= 2
    assert stats["total_projects"] >= 2
    print(f"[OK] Admin Stats: Total Regs: {stats['total_registrations']} (Internal: {stats['internal_registrations']}, External: {stats['external_registrations']}), Projects: {stats['total_projects']}")

    # 6c. Approve Project
    r = client.patch(
        f"/api/admin/projects/{hw_record['id']}/status",
        json={"status": "approved", "admin_notes": "Assigned to Pavilion Booth H-01"},
        headers=headers,
    )
    assert r.status_code == 200, f"Approve project failed: {r.text}"
    updated_hw = r.json()
    assert updated_hw["status"] == "approved"
    print(f"[OK] Admin approved Hardware project {hw_record['project_code']}.")

    # 6d. Verify approved project appears in public showcase
    r = client.get("/api/projects/public")
    assert r.status_code == 200
    public_projects = r.json()
    assert any(p["id"] == hw_record["id"] for p in public_projects)
    print("[OK] Approved project visible in public showcase endpoint.")

    # 6e. Test CSV Export
    r = client.get("/api/admin/registrations/export-csv", headers=headers)
    assert r.status_code == 200
    assert "text/csv" in r.headers["content-type"]
    assert "Registration Code,Full Name,Email" in r.text
    print("[OK] CSV export generated successfully with registration records.")

    # 6f. Update Event Status
    r = client.put(
        "/api/events/bhavesh-workshop",
        json={"registration_status": "waitlist"},
        headers=headers,
    )
    assert r.status_code == 200
    assert r.json()["registration_status"] == "waitlist"
    print("[OK] Event configuration updated by admin (Status changed to waitlist).")

    # Reset back to open
    client.put("/api/events/bhavesh-workshop", json={"registration_status": "open"}, headers=headers)

    # 7. FAQs & Settings Public endpoints
    r = client.get("/api/faqs")
    assert r.status_code == 200
    assert len(r.json()) >= 8
    print(f"[OK] Public FAQs verified ({len(r.json())} items).")

    r = client.get("/api/settings")
    assert r.status_code == 200
    assert r.json()["festival_name"] == "TECH GALLERY 2027"
    print("[OK] Public Settings & Contact channels verified.")

    print("\n[SUCCESS] ALL BACKEND VERIFICATIONS & ELIGIBILITY ENFORCEMENTS PASSED WITH 100% SUCCESS!")

if __name__ == "__main__":
    run_tests()

