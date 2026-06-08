from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.pizza import Pizza
from app.schemas.pizza import PizzaOut

router = APIRouter(prefix="/pizzas", tags=["pizzas"])


@router.get("")
def list_pizzas(db: Session = Depends(get_db)):
    pizzas = db.query(Pizza).all()
    data = [PizzaOut.model_validate(pizza).model_dump() for pizza in pizzas]
    return {"success": True, "data": {"pizzas": data}, "message": None}
