from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.models.subscription import Subscription
from app.models.user import User

PLAN_CREDITS = {"BASIC": 2, "PRO": 5}


def create_or_replace_subscription(
    db: Session, user_id: int, plan_type: str
) -> tuple[Subscription | None, str | None, int]:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None, "Invalid user", 404

    now = datetime.now(timezone.utc)
    end_date = now + timedelta(days=7)
    credits = PLAN_CREDITS[plan_type]

    existing = db.query(Subscription).filter(Subscription.user_id == user_id).first()
    if existing:
        existing.plan_type = plan_type
        existing.credits_remaining = credits
        existing.start_date = now
        existing.end_date = end_date
        existing.auto_renew = False
        db.commit()
        db.refresh(existing)
        return existing, None, 200

    subscription = Subscription(
        user_id=user_id,
        plan_type=plan_type,
        credits_remaining=credits,
        start_date=now,
        end_date=end_date,
        auto_renew=False,
    )
    db.add(subscription)
    db.commit()
    db.refresh(subscription)
    return subscription, None, 201


def get_subscription_for_user(db: Session, user_id: int) -> Subscription | None:
    subscription = db.query(Subscription).filter(Subscription.user_id == user_id).first()
    if not subscription:
        return None

    now = datetime.now(timezone.utc)
    if subscription.end_date <= now and subscription.credits_remaining != 0:
        subscription.credits_remaining = 0
        db.commit()
        db.refresh(subscription)
    return subscription


def validate_and_deduct_credits(
    db: Session, user_id: int, total_pizzas: int
) -> tuple[bool, str | None, int]:
    subscription = (
        db.query(Subscription)
        .filter(Subscription.user_id == user_id)
        .with_for_update()
        .first()
    )

    if not subscription:
        return False, "No active subscription", 400

    now = datetime.now(timezone.utc)
    if subscription.end_date <= now:
        if subscription.credits_remaining != 0:
            subscription.credits_remaining = 0
            db.flush()
        return False, "No active subscription", 400

    if subscription.credits_remaining < total_pizzas:
        return False, "Not enough credits", 400

    subscription.credits_remaining -= total_pizzas
    if subscription.credits_remaining < 0:
        subscription.credits_remaining = 0
    db.flush()
    return True, None, 200
