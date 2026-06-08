from sqlalchemy.orm import Session

from app.models.order import Order
from app.models.user import User
from app.services.subscription_service import get_subscription_for_user

ORDER_STATUS_KEYWORDS = ("order", "status", "where")
DELIVERY_ETA_KEYWORDS = ("when", "arrive", "eta")
SUBSCRIPTION_CREDITS_KEYWORDS = ("credits", "balance")


def handle_chat_query(db: Session, user_id: int, message: str) -> tuple[str | None, str | None, int]:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None, "Invalid user", 404

    normalized = message.lower()

    if any(keyword in normalized for keyword in ORDER_STATUS_KEYWORDS):
        latest_order = (
            db.query(Order)
            .filter(Order.user_id == user_id)
            .order_by(Order.created_at.desc())
            .first()
        )
        if not latest_order:
            return "You have no active orders", None, 200
        return f"Your order is currently {latest_order.status}", None, 200

    if any(keyword in normalized for keyword in DELIVERY_ETA_KEYWORDS):
        return "Your order will arrive in approximately 20 minutes", None, 200

    if any(keyword in normalized for keyword in SUBSCRIPTION_CREDITS_KEYWORDS):
        subscription = get_subscription_for_user(db, user_id)
        if not subscription:
            return "You do not have an active subscription", None, 200
        return f"You have {subscription.credits_remaining} credits remaining", None, 200

    return (
        "Sorry, I can only help with order status, delivery time, and credits.",
        None,
        200,
    )
