from datetime import datetime
from typing import Literal

from pydantic import BaseModel


class CreateSubscriptionRequest(BaseModel):
    user_id: int
    plan_type: Literal["BASIC", "PRO"]


class SubscriptionOut(BaseModel):
    id: int
    user_id: int
    plan_type: str
    credits_remaining: int
    start_date: datetime
    end_date: datetime
    auto_renew: bool

    model_config = {"from_attributes": True}
