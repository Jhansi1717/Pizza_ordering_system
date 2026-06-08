from sqlalchemy.orm import Session, joinedload

from app.models.order import Order, OrderItem
from app.models.pizza import Pizza
from app.models.user import User
from app.models.event_log import EventLog
from app.schemas.order import CreateOrderRequest
from app.services.subscription_service import validate_and_deduct_credits


def create_order(db: Session, payload: CreateOrderRequest) -> tuple[Order | None, str | None, int]:
    user = db.query(User).filter(User.id == payload.user_id).first()
    if not user:
        return None, "Invalid user", 404

    if not payload.items:
        return None, "Empty items", 400

    pizza_ids = [item.pizza_id for item in payload.items]
    pizzas = db.query(Pizza).filter(Pizza.id.in_(pizza_ids)).all()
    if len(pizzas) != len(set(pizza_ids)):
        return None, "Invalid pizza", 400

    total_pizzas = sum(item.quantity for item in payload.items)
    # Try to deduct subscription credits, but don't block the order if user has no
    # active subscription or not enough credits (pay-per-order is allowed).
    can_create, credit_error, credit_error_code = validate_and_deduct_credits(
        db, payload.user_id, total_pizzas
    )
    if not can_create:
        # Only hard-block on unexpected errors, not missing/exhausted subscription
        if credit_error_code not in (400, 404):
            db.rollback()
            return None, credit_error, credit_error_code

    order = Order(user_id=payload.user_id, status="CREATED")
    db.add(order)
    db.flush()

    for item in payload.items:
        order_item = OrderItem(
            order_id=order.id,
            pizza_id=item.pizza_id,
            quantity=item.quantity,
            customizations=item.customizations,
        )
        db.add(order_item)

    db.add(
        EventLog(
            user_id=payload.user_id,
            event_type="order_created",
            event_metadata={
                "order_id": order.id,
                "items": [
                    {"pizza_id": item.pizza_id, "quantity": item.quantity}
                    for item in payload.items
                ],
            },
        )
    )

    db.commit()
    db.refresh(order)
    loaded_order = get_order_by_id(db, order.id)
    return loaded_order, None, 201


def get_order_by_id(db: Session, order_id: int) -> Order | None:
    return (
        db.query(Order)
        .options(joinedload(Order.items))
        .filter(Order.id == order_id)
        .first()
    )
