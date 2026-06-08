from datetime import datetime

from pydantic import BaseModel, Field


class CreateOrderItemRequest(BaseModel):
    pizza_id: int
    quantity: int = Field(gt=0)
    customizations: dict | None = None


class CreateOrderRequest(BaseModel):
    user_id: int
    items: list[CreateOrderItemRequest]


class OrderItemOut(BaseModel):
    id: int
    pizza_id: int
    quantity: int
    customizations: dict | None

    model_config = {"from_attributes": True}


class OrderOut(BaseModel):
    id: int
    user_id: int
    slot_id: int | None
    status: str
    created_at: datetime
    items: list[OrderItemOut]

    model_config = {"from_attributes": True}
