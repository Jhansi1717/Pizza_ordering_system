from datetime import datetime

from pydantic import BaseModel


class GeneratePreOrderRequest(BaseModel):
    user_id: int


class PreOrderOut(BaseModel):
    id: int
    user_id: int
    suggested_items: list[dict]
    status: str
    expires_at: datetime

    model_config = {"from_attributes": True}
