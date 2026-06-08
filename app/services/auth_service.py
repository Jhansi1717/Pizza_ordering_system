from sqlalchemy.orm import Session

from app.models.user import User

VALID_OTP = "1234"


def login_with_phone(db: Session, phone: str) -> None:
    user = db.query(User).filter(User.phone == phone).first()
    if not user:
        user = User(phone=phone)
        db.add(user)
        db.commit()


def verify_otp(db: Session, phone: str, otp: str) -> int | None:
    if otp != VALID_OTP:
        return None
    user = db.query(User).filter(User.phone == phone).first()
    if not user:
        return None
    return user.id
