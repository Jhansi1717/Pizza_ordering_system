from collections import Counter
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.event_log import EventLog
from app.models.pizza import Pizza
from app.models.user import User


def _hour_distance(current_hour: int, event_hour: int) -> int:
    diff = abs(current_hour - event_hour)
    return min(diff, 24 - diff)


def get_recommended_pizza(
    db: Session, user_id: int
) -> tuple[Pizza | None, str | None, int]:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None, "User not found", 404

    now_hour = datetime.now(timezone.utc).hour
    user_events = (
        db.query(EventLog.event_metadata, EventLog.timestamp)
        .filter(EventLog.user_id == user_id, EventLog.event_type == "order_created")
        .all()
    )

    counts: Counter[int] = Counter()
    for event_metadata, timestamp in user_events:
        if _hour_distance(now_hour, timestamp.hour) > 2:
            continue
        items = event_metadata.get("items", []) if isinstance(event_metadata, dict) else []
        for item in items:
            pizza_id = item.get("pizza_id")
            quantity = item.get("quantity", 0)
            if isinstance(pizza_id, int) and isinstance(quantity, int) and quantity > 0:
                counts[pizza_id] += quantity

    selected_pizza_id: int | None = counts.most_common(1)[0][0] if counts else None

    if selected_pizza_id is None:
        global_events = (
            db.query(EventLog.event_metadata)
            .filter(EventLog.event_type == "order_created")
            .all()
        )
        global_counts: Counter[int] = Counter()
        for (event_metadata,) in global_events:
            items = (
                event_metadata.get("items", []) if isinstance(event_metadata, dict) else []
            )
            for item in items:
                pizza_id = item.get("pizza_id")
                quantity = item.get("quantity", 0)
                if isinstance(pizza_id, int) and isinstance(quantity, int) and quantity > 0:
                    global_counts[pizza_id] += quantity
        if global_counts:
            selected_pizza_id = global_counts.most_common(1)[0][0]

    if selected_pizza_id is None:
        pizza = db.query(Pizza).order_by(Pizza.id.asc()).first()
        return pizza, None, 200

    pizza = db.query(Pizza).filter(Pizza.id == selected_pizza_id).first()
    if pizza:
        return pizza, None, 200

    fallback_pizza = db.query(Pizza).order_by(Pizza.id.asc()).first()
    return fallback_pizza, None, 200
