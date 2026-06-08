from pydantic import BaseModel


class PizzaOut(BaseModel):
    id: int
    name: str
    description: str | None = None
    image_url: str | None = None
    base_type: str
    prep_time: int
    price: float

    model_config = {"from_attributes": True}
