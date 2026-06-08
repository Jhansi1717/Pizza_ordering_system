from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.subscription import CreateSubscriptionRequest, SubscriptionOut
from app.services.subscription_service import (
    create_or_replace_subscription,
    get_subscription_for_user,
)

router = APIRouter(prefix="/subscriptions", tags=["subscriptions"])


@router.post("")
def create_subscription(payload: CreateSubscriptionRequest, db: Session = Depends(get_db)):
    subscription, error_message, status_code = create_or_replace_subscription(
        db, payload.user_id, payload.plan_type
    )
    if error_message:
        return JSONResponse(
            status_code=status_code,
            content={"success": False, "data": {}, "message": error_message},
        )

    data = SubscriptionOut.model_validate(subscription).model_dump(mode="json")
    return JSONResponse(
        status_code=status_code,
        content={"success": True, "data": data, "message": None},
    )


@router.get("/me")
def get_my_subscription(user_id: int, db: Session = Depends(get_db)):
    subscription = get_subscription_for_user(db, user_id)
    if not subscription:
        return JSONResponse(
            status_code=404,
            content={"success": False, "data": {}, "message": "Subscription not found"},
        )

    data = SubscriptionOut.model_validate(subscription).model_dump(mode="json")
    return {"success": True, "data": data, "message": None}
