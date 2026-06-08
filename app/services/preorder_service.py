from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.models.event_log import EventLog
from app.models.order import Order, OrderItem
from app.services.order_service import get_order_by_id
from app.models.preorder import PreOrder
from app.models.slot import Slot
from app.models.user import User
from app.services.recommendation_service import get_recommended_pizza
from app.services.subscription_service import validate_and_deduct_credits

PENDING_CONFIRMATION = "PENDING_CONFIRMATION"
CONFIRMED = "CONFIRMED"
EXPIRED = "EXPIRED"
CANCELLED = "CANCELLED"


def expire_pending_preorders(db: Session, user_id: int | None = None) -> None:
    now = datetime.now(timezone.utc)
    query = db.query(PreOrder).filter(
        PreOrder.status == PENDING_CONFIRMATION, PreOrder.expires_at < now
    )
    if user_id is not None:
        query = query.filter(PreOrder.user_id == user_id)
    expired = query.all()
    if not expired:
        return

    for preorder in expired:
        preorder.status = EXPIRED
    db.commit()


def generate_preorder(db: Session, user_id: int) -> tuple[PreOrder | None, str | None, int]:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None, "Invalid user", 404

    pizza, error_message, status_code = get_recommended_pizza(db, user_id)
    if error_message:
        return None, error_message, status_code
    if not pizza:
        return None, "No pizzas available", 400

    preorder = PreOrder(
        user_id=user_id,
        suggested_items=[{"pizza_id": pizza.id, "quantity": 1}],
        status=PENDING_CONFIRMATION,
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=15),
    )
    db.add(preorder)
    db.commit()
    db.refresh(preorder)
    return preorder, None, 201


def get_active_preorders(db: Session, user_id: int) -> tuple[list[PreOrder] | None, str | None, int]:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None, "Invalid user", 404

    expire_pending_preorders(db, user_id=user_id)
    preorders = (
        db.query(PreOrder)
        .filter(PreOrder.user_id == user_id, PreOrder.status == PENDING_CONFIRMATION)
        .order_by(PreOrder.id.desc())
        .all()
    )
    return preorders, None, 200


def confirm_preorder(db: Session, preorder_id: int) -> tuple[Order | None, str | None, int]:
    expire_pending_preorders(db)
    preorder = db.query(PreOrder).filter(PreOrder.id == preorder_id).first()
    if not preorder:
        return None, "PreOrder not found", 404
    if preorder.status != PENDING_CONFIRMATION:
        return None, "PreOrder cannot be confirmed", 400

    now = datetime.now(timezone.utc)
    if preorder.expires_at < now:
        preorder.status = EXPIRED
        db.commit()
        return None, "PreOrder expired", 400

    items = preorder.suggested_items if isinstance(preorder.suggested_items, list) else []
    if not items:
        return None, "PreOrder has no items", 400

    total_pizzas = sum(int(item.get("quantity", 0)) for item in items)
    can_create, credit_error, credit_status = validate_and_deduct_credits(
        db, preorder.user_id, total_pizzas
    )
    if not can_create:
        db.rollback()
        return None, credit_error, credit_status

    slot = (
        db.query(Slot)
        .filter(Slot.start_time >= now, Slot.used_capacity < Slot.capacity)
        .order_by(Slot.start_time.asc())
        .with_for_update()
        .first()
    )
    if not slot:
        db.rollback()
        return None, "No available slots", 400

    order = Order(user_id=preorder.user_id, status="CREATED", slot_id=slot.id)
    db.add(order)
    db.flush()

    for item in items:
        db.add(
            OrderItem(
                order_id=order.id,
                pizza_id=int(item.get("pizza_id")),
                quantity=int(item.get("quantity")),
                customizations=None,
            )
        )

    slot.used_capacity += 1

    preorder.status = CONFIRMED
    db.add(
        EventLog(
            user_id=preorder.user_id,
            event_type="order_created",
            event_metadata={"order_id": order.id, "items": items},
        )
    )

    db.commit()
    loaded_order = get_order_by_id(db, order.id)
    return loaded_order, None, 200


def cancel_preorder(db: Session, preorder_id: int) -> tuple[PreOrder | None, str | None, int]:
    preorder = db.query(PreOrder).filter(PreOrder.id == preorder_id).first()
    if not preorder:
        return None, "PreOrder not found", 404
    if preorder.status == CONFIRMED:
        return None, "PreOrder already confirmed, cannot cancel", 400
    if preorder.status == CANCELLED:
        return None, "PreOrder already cancelled", 400
    if preorder.status == EXPIRED:
        return None, "PreOrder already expired", 400

    now = datetime.now(timezone.utc)
    if preorder.expires_at < now:
        preorder.status = EXPIRED
        db.commit()
        db.refresh(preorder)
        return None, "PreOrder has expired", 400

    preorder.status = CANCELLED
    db.commit()
    db.refresh(preorder)
    return preorder, None, 200
