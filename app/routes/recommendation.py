from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.pizza import PizzaOut
from app.services.recommendation_service import get_recommended_pizza

router = APIRouter(prefix="/recommendation", tags=["recommendation"])


@router.get("")
def recommendation(user_id: int, db: Session = Depends(get_db)):
    pizza, error_message, status_code = get_recommended_pizza(db, user_id)
    if error_message:
        return JSONResponse(
            status_code=status_code,
            content={"success": False, "data": {}, "message": error_message},
        )

    if not pizza:
        return {"success": True, "data": {"pizza": None}, "message": None}

    return {
        "success": True,
        "data": {"pizza": PizzaOut.model_validate(pizza).model_dump()},
        "message": None,
    }
