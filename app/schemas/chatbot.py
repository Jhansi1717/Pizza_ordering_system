from pydantic import BaseModel


class ChatQueryRequest(BaseModel):
    user_id: int
    message: str
