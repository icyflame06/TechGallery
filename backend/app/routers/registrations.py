import secrets
import urllib.parse
import logging
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Registration, Event, FestivalSettings
from app.schemas import RegistrationCreate, RegistrationOut
from app.config import settings

logger = logging.getLogger("techgallery.registrations")
router = APIRouter(prefix="/api/registrations", tags=["Registrations"])

def is_our_college(college_name: str, official_name: str) -> bool:
    norm_input = college_name.strip().lower()
    norm_official = official_name.strip().lower()
    if norm_input == norm_official:
        return True
    keywords = ["our college", "tech gallery", "tgec", "tgit", "host college", "internal", "ljcca", "lj cca", "lj", "lj university", "lj institute"]
    for kw in keywords:
        if kw in norm_input:
            return True
    return False

def clean_phone_for_whatsapp(phone: str) -> str:
    digits = "".join([c for c in phone if c.isdigit()])
    if len(digits) == 10 and digits[0] in "6789":
        return f"91{digits}"
    return digits

def generate_whatsapp_link(phone: str, message: str) -> str:
    clean_digits = clean_phone_for_whatsapp(phone)
    encoded = urllib.parse.quote(message)
    return f"https://wa.me/{clean_digits}?text={encoded}"

def send_admin_approval_email(reg: Registration, approval_url: str):
    """
    Logs and prepares admin approval email.
    In production, this hooks to SendGrid/Resend/SMTP.
    """
    email_body = f"""
==================== [ADMIN NOTIFICATION EMAIL] ====================
To: {settings.ADMIN_EMAIL}
Subject: [ACTION REQUIRED] New Project Showcasing Registration - {reg.full_name} ({reg.reg_code})

A student has registered for PROJECT SHOWCASING at Tech Gallery 2027:
- Name: {reg.full_name}
- Email: {reg.email}
- Phone: {reg.phone}
- College: {reg.college_name} ({'Internal Student' if reg.is_internal else 'External College'})
- Department: {reg.department} ({reg.year_semester})
- Event: {reg.event_name}
- Registration ID: {reg.reg_code}
- Team Name: {reg.team_name or 'Individual'}

To APPROVE this registration and unlock project submission access for this student, click below:
{approval_url}
====================================================================
"""
    logger.info(email_body)
    print(email_body)

@router.post("", response_model=RegistrationOut, status_code=status.HTTP_201_CREATED)
def create_registration(payload: RegistrationCreate, db: Session = Depends(get_db)):
    # 1. Fetch Event
    event = db.query(Event).filter(Event.id == payload.event_id).first()
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Event '{payload.event_id}' not found."
        )

    # 2. Check Event Status
    if event.registration_status == "closed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Registration for {event.name} is currently closed."
        )
    if event.registration_status == "announced" or event.eligibility_type == "results_only":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Registration is not required for the Hackathon Results announcement ceremony."
        )

    # 3. Fetch college name setting
    settings_obj = db.query(FestivalSettings).filter(FestivalSettings.id == "default").first()
    our_college_name = settings_obj.our_college_name if settings_obj else "Tech Gallery Engineering College"

    is_internal = is_our_college(payload.college_name, our_college_name)

    # 4. Strict Eligibility Enforcement: External students can only select from Tech Showcase days
    if not is_internal and not event.is_showcase:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Participation Restricted: External college students can only select from Tech Showcase days. "
                f"'{event.name}' is reserved for students of our college ({our_college_name})."
            )
        )

    # 5. Check Duplicate Registrations by Email or Phone for this Event
    existing_by_email = db.query(Registration).filter(
        Registration.email.ilike(payload.email.strip()),
        Registration.event_id == payload.event_id
    ).first()
    if existing_by_email:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"A registration with email '{payload.email}' already exists for {event.name} (Registration ID: {existing_by_email.reg_code})."
        )

    existing_by_phone = db.query(Registration).filter(
        Registration.phone == payload.phone.strip(),
        Registration.event_id == payload.event_id
    ).first()
    if existing_by_phone:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"A registration with phone number '{payload.phone}' already exists for {event.name} (Registration ID: {existing_by_phone.reg_code})."
        )

    # 6. Generate Unique Registration ID
    random_hex = secrets.token_hex(3).upper()
    reg_code = f"TG27-REG-{random_hex}"
    while db.query(Registration).filter(Registration.reg_code == reg_code).first():
        random_hex = secrets.token_hex(3).upper()
        reg_code = f"TG27-REG-{random_hex}"

    # 7. Two Registration Types:
    # 'visitor' -> Immediately confirmed, Free entry
    # 'showcasing' -> 'pending_approval', Free exhibition pass, Admin gets an email with 1-click approval link
    reg_type = payload.registration_type
    approval_token = None
    if reg_type == "showcasing":
        status_val = "pending_approval"
        can_submit = False
        approval_token = secrets.token_urlsafe(32)
    else:
        reg_type = "visitor"
        status_val = "confirmed"
        can_submit = False

    # 8. Create record
    registration = Registration(
        reg_code=reg_code,
        full_name=payload.full_name.strip(),
        email=payload.email.strip().lower(),
        phone=payload.phone.strip(),
        college_name=payload.college_name.strip(),
        is_internal=is_internal,
        roll_number=payload.roll_number.strip() if payload.roll_number else None,
        department=payload.department.strip(),
        year_semester=payload.year_semester.strip(),
        event_id=payload.event_id,
        event_name=event.name,
        team_name=payload.team_name.strip() if payload.team_name else None,
        team_members=payload.team_members.strip() if payload.team_members else None,
        status=status_val,
        registration_type=reg_type,
        approval_token=approval_token,
        can_submit_project=can_submit,
    )

    db.add(registration)
    db.commit()
    db.refresh(registration)

    # 9. Admin Email & WhatsApp Message Generation
    if reg_type == "showcasing" and approval_token:
        approval_url = f"http://localhost:8000/api/registrations/approve/{approval_token}"
        send_admin_approval_email(registration, approval_url)
        whatsapp_msg = (
            f"⏳ *TECH GALLERY 2027*\n"
            f"Hi {registration.full_name},\n"
            f"We have received your *Project Showcasing* registration!\n\n"
            f"📋 *Registration ID:* {registration.reg_code}\n"
            f"🏫 *College:* {registration.college_name}\n"
            f"🎫 *Pass Type:* Project Showcasing (Free)\n"
            f"⚠️ *Status:* Pending Admin Approval\n\n"
            f"Once our faculty committee reviews and approves your registration, you will receive project submission access to upload your hardware/software prototype.\n\n"
            f"📍 *Venue:* LJCCA, NEAR NEW, IIM Rd, Vastrapur, Ahmedabad, Gujarat 380015\n"
            f"🗺️ *Location:* https://share.google/wWJlNwjeWMOJeZC5y\n"
            f"📅 *Dates:* 18–24 Jan 2027"
        )
    else:
        whatsapp_msg = (
            f"🎉 *TECH GALLERY 2027 CONFIRMATION*\n"
            f"Hi {registration.full_name},\n"
            f"Your *Visitor Pass* is confirmed (Free Entry)!\n\n"
            f"📋 *Registration ID:* {registration.reg_code}\n"
            f"🎪 *Event:* {registration.event_name}\n"
            f"📅 *Dates:* 18–24 January 2027\n"
            f"📍 *Venue:* LJCCA, NEAR NEW, IIM Rd, Vastrapur, Ahmedabad, Gujarat 380015\n"
            f"🗺️ *Location:* https://share.google/wWJlNwjeWMOJeZC5y\n\n"
            f"Show this Registration ID at the welcome desk on campus. See you there!"
        )

    wa_link = generate_whatsapp_link(registration.phone, whatsapp_msg)

    # Attach dynamic non-persisted attributes for response
    try:
        out = RegistrationOut.model_validate(registration, from_attributes=True)
    except Exception:
        out = RegistrationOut.from_orm(registration)
    out.whatsapp_url = wa_link
    out.whatsapp_message = whatsapp_msg
    return out

@router.get("/approve/{approval_token}", response_class=HTMLResponse)
def approve_registration_via_token(approval_token: str, db: Session = Depends(get_db)):
    reg = db.query(Registration).filter(Registration.approval_token == approval_token.strip()).first()
    if not reg:
        return HTMLResponse(
            content="""
            <html>
              <body style="font-family:sans-serif;background:#141716;color:#EDF0EC;padding:40px;text-align:center;">
                <h1 style="color:#D6331F;">Invalid or Expired Approval Link</h1>
                <p>This registration could not be found or has already been processed.</p>
                <a href="http://localhost:5173" style="color:#CDFF2B;">Return to Tech Gallery 2027</a>
              </body>
            </html>
            """,
            status_code=404
        )

    reg.status = "approved"
    reg.can_submit_project = True
    db.commit()

    # Generate approval WhatsApp link
    submission_url = f"http://localhost:5173/?submit_project=true&reg_code={reg.reg_code}&email={urllib.parse.quote(reg.email)}"
    approval_wa_msg = (
        f"✅ *TECH GALLERY 2027 - PROJECT SHOWCASING APPROVED!*\n"
        f"Hi {reg.full_name},\n"
        f"Great news! Your registration has been APPROVED by the committee.\n\n"
        f"📋 *Registration ID:* {reg.reg_code}\n"
        f"🚀 *Next Step:* You can now submit your Hardware or Software project.\n\n"
        f"Submit your project details here:\n{submission_url}\n\n"
        f"See you on 18–24 Jan 2027!"
    )
    wa_link = generate_whatsapp_link(reg.phone, approval_wa_msg)

    return HTMLResponse(
        content=f"""
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Registration Approved - Tech Gallery 2027</title>
            <style>
              body {{ background:#141716; color:#EDF0EC; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display:flex; justify-content:center; align-items:center; min-height:100vh; margin:0; padding:20px; box-sizing:border-box; }}
              .card {{ background:#1A1E1C; border:1px solid #2B302D; border-top:4px solid #CDFF2B; padding:36px; max-width:540px; border-radius:4px; text-align:left; }}
              h1 {{ color:#CDFF2B; margin-top:0; font-size:24px; }}
              .pill {{ display:inline-block; background:#CDFF2B; color:#101312; font-weight:bold; font-size:12px; padding:3px 10px; border-radius:2px; margin-bottom:16px; }}
              .btn {{ display:inline-block; background:#CDFF2B; color:#101312; font-weight:600; text-decoration:none; padding:12px 20px; border-radius:2px; margin-top:20px; }}
              .btn-wa {{ display:inline-block; background:#25D366; color:#FFFFFF; font-weight:600; text-decoration:none; padding:12px 20px; border-radius:2px; margin-top:20px; margin-left:10px; }}
              .info {{ background:#141716; padding:14px; border:1px solid #2B302D; font-family:monospace; font-size:13px; line-height:1.6; margin:16px 0; }}
            </style>
          </head>
          <body>
            <div class="card">
              <span class="pill">APPROVED</span>
              <h1>Registration Approved Successfully!</h1>
              <p>You have approved <strong>{reg.full_name}</strong> for <strong>Project Showcasing</strong> at Tech Gallery 2027.</p>
              
              <div class="info">
                <div><strong>Registration ID:</strong> {reg.reg_code}</div>
                <div><strong>Student Name:</strong> {reg.full_name}</div>
                <div><strong>College:</strong> {reg.college_name}</div>
                <div><strong>Phone / WhatsApp:</strong> {reg.phone}</div>
                <div><strong>Project Submission:</strong> UNLOCKED &amp; ENABLED</div>
              </div>

              <p style="color:#8A908C; font-size:14px;">The student can now submit their project details. You can also send them the WhatsApp approval confirmation immediately:</p>

              <div>
                <a class="btn" href="{submission_url}" target="_blank">Open Project Submission Form</a>
                <a class="btn-wa" href="{wa_link}" target="_blank">Send WhatsApp Notification</a>
              </div>
            </div>
          </body>
        </html>
        """
    )

@router.get("/check-submission-access")
def check_submission_access(reg_code: str, email: str, db: Session = Depends(get_db)):
    reg = db.query(Registration).filter(
        Registration.reg_code == reg_code.strip().upper(),
        Registration.email.ilike(email.strip())
    ).first()

    if not reg:
        raise HTTPException(
            status_code=404,
            detail="No registration found matching this Registration ID and Email."
        )

    if not reg.can_submit_project:
        raise HTTPException(
            status_code=403,
            detail=f"Registration {reg.reg_code} has not been approved for project submission yet (Current status: {reg.status}). Please wait for admin approval."
        )

    return {
        "allowed": True,
        "reg_code": reg.reg_code,
        "full_name": reg.full_name,
        "email": reg.email,
        "phone": reg.phone,
        "college_name": reg.college_name,
        "department": reg.department,
        "team_name": reg.team_name,
        "team_members": reg.team_members
    }

@router.get("/{reg_code}", response_model=RegistrationOut)
def get_registration_by_code(reg_code: str, db: Session = Depends(get_db)):
    reg = db.query(Registration).filter(Registration.reg_code == reg_code.strip().upper()).first()
    if not reg:
        raise HTTPException(status_code=404, detail="Registration code not found")
    
    # Generate WhatsApp message on the fly for code lookup
    if reg.status == "approved" or reg.can_submit_project:
        sub_url = f"http://localhost:5173/?submit_project=true&reg_code={reg.reg_code}&email={urllib.parse.quote(reg.email)}"
        wa_msg = (
            f"✅ *TECH GALLERY 2027 - APPROVED*\n"
            f"Hi {reg.full_name},\n"
            f"Your Registration ID: {reg.reg_code}\n"
            f"Submit your project at: {sub_url}"
        )
    elif reg.registration_type == "showcasing":
        wa_msg = (
            f"⏳ *TECH GALLERY 2027*\n"
            f"Hi {reg.full_name}, your Project Showcasing registration {reg.reg_code} is pending admin review."
        )
    else:
        wa_msg = (
            f"🎉 *TECH GALLERY 2027*\n"
            f"Hi {reg.full_name}, your Visitor Pass {reg.reg_code} is confirmed! Free Entry."
        )

    out = RegistrationOut.from_orm(reg)
    out.whatsapp_url = generate_whatsapp_link(reg.phone, wa_msg)
    out.whatsapp_message = wa_msg
    return out
