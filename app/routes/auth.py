from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.user import LoginRequest, VerifyOtpRequest
from app.services.auth_service import login_with_phone, verify_otp

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    login_with_phone(db, payload.phone)
    return {"success": True, "data": {}, "message": "OTP sent"}


@router.post("/verify-otp")
def verify(payload: VerifyOtpRequest, db: Session = Depends(get_db)):
    user_id = verify_otp(db, payload.phone, payload.otp)
    if user_id is None:
        return {"success": False, "data": {}, "message": "Invalid OTP or user"}
    return {"success": True, "data": {"user_id": user_id}, "message": None}
