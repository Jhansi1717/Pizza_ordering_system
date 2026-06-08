from pydantic import BaseModel


class LoginRequest(BaseModel):
    phone: str


class VerifyOtpRequest(BaseModel):
    phone: str
    otp: str


class VerifyOtpResponse(BaseModel):
    user_id: int


class ApiResponse(BaseModel):
    success: bool
    data: dict
    message: str | None = None
