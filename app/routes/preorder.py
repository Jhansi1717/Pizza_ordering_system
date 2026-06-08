from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.order import OrderOut
from app.schemas.preorder import GeneratePreOrderRequest, PreOrderOut
from app.services.preorder_service import (
    cancel_preorder,
    confirm_preorder,
    generate_preorder,
    get_active_preorders,
)

router = APIRouter(prefix="/preorders", tags=["preorders"])


@router.post("/generate")
def generate(payload: GeneratePreOrderRequest, db: Session = Depends(get_db)):
    preorder, error_message, status_code = generate_preorder(db, payload.user_id)
    if error_message:
        return JSONResponse(
            status_code=status_code,
            content={"success": False, "data": {}, "message": error_message},
        )
    data = PreOrderOut.model_validate(preorder).model_dump(mode="json")
    return JSONResponse(
        status_code=status_code,
        content={"success": True, "data": {"preorder": data}, "message": None},
    )


@router.get("")
def list_preorders(user_id: int, db: Session = Depends(get_db)):
    preorders, error_message, status_code = get_active_preorders(db, user_id)
    if error_message:
        return JSONResponse(
            status_code=status_code,
            content={"success": False, "data": {}, "message": error_message},
        )
    data = [PreOrderOut.model_validate(p).model_dump(mode="json") for p in preorders]
    return {"success": True, "data": {"preorders": data}, "message": None}


@router.post("/{preorder_id}/confirm")
def confirm(preorder_id: int, db: Session = Depends(get_db)):
    order, error_message, status_code = confirm_preorder(db, preorder_id)
    if error_message:
        return JSONResponse(
            status_code=status_code,
            content={"success": False, "data": {}, "message": error_message},
        )
    data = OrderOut.model_validate(order).model_dump(mode="json")
    return {"success": True, "data": {"order": data}, "message": None}


@router.post("/{preorder_id}/cancel")
def cancel(preorder_id: int, db: Session = Depends(get_db)):
    preorder, error_message, status_code = cancel_preorder(db, preorder_id)
    if error_message:
        return JSONResponse(
            status_code=status_code,
            content={"success": False, "data": {}, "message": error_message},
        )
    data = PreOrderOut.model_validate(preorder).model_dump(mode="json")
    return {"success": True, "data": {"preorder": data}, "message": None}
