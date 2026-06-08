from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.chatbot import ChatQueryRequest
from app.services.chatbot_service import handle_chat_query

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/query")
def query(payload: ChatQueryRequest, db: Session = Depends(get_db)):
    response_text, error_message, status_code = handle_chat_query(
        db, payload.user_id, payload.message
    )
    if error_message:
        return JSONResponse(
            status_code=status_code,
            content={"success": False, "data": {}, "message": error_message},
        )
    return {"success": True, "data": {"response": response_text}, "message": None}
