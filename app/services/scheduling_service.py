from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.models.slot import Slot

SLOT_MINUTES = 15
SLOT_CAPACITY = 20


def initialize_slots(db: Session) -> None:
    now = datetime.now(timezone.utc).replace(second=0, microsecond=0)
    minute_floor = (now.minute // SLOT_MINUTES) * SLOT_MINUTES
    start_anchor = now.replace(minute=minute_floor)
    if start_anchor < now:
        start_anchor += timedelta(minutes=SLOT_MINUTES)

    end_window = start_anchor + timedelta(hours=24)
    existing_slots = (
        db.query(Slot.start_time)
        .filter(Slot.start_time >= start_anchor, Slot.start_time < end_window)
        .all()
    )
    existing_times = {row[0] for row in existing_slots}

    new_slots: list[Slot] = []
    current = start_anchor
    while current < end_window:
        if current not in existing_times:
            new_slots.append(
                Slot(
                    start_time=current,
                    end_time=current + timedelta(minutes=SLOT_MINUTES),
                    capacity=SLOT_CAPACITY,
                    used_capacity=0,
                )
            )
        current += timedelta(minutes=SLOT_MINUTES)

    if new_slots:
        db.add_all(new_slots)
        db.commit()
