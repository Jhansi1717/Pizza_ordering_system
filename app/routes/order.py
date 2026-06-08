from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.order import CreateOrderRequest, OrderOut
from app.services.order_service import create_order, get_order_by_id

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("")
def create(payload: CreateOrderRequest, db: Session = Depends(get_db)):
    order, error_message, status_code = create_order(db, payload)
    if error_message:
        return JSONResponse(
            status_code=status_code,
            content={"success": False, "data": {}, "message": error_message},
        )
    order_data = OrderOut.model_validate(order).model_dump(mode="json")
    return JSONResponse(
        status_code=201,
        content={"success": True, "data": {"order": order_data}, "message": None},
    )


@router.get("/{order_id}")
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = get_order_by_id(db, order_id)
    if not order:
        return JSONResponse(
            status_code=404,
            content={"success": False, "data": {}, "message": "Order not found"},
        )
    order_data = OrderOut.model_validate(order).model_dump(mode="json")
    return {"success": True, "data": {"order": order_data}, "message": None}
