from datetime import datetime

from sqlalchemy import JSON, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    slot_id: Mapped[int | None] = mapped_column(ForeignKey("slots.id"), nullable=True)
    status: Mapped[str] = mapped_column(String, default="CREATED", nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"), nullable=False)
    pizza_id: Mapped[int] = mapped_column(ForeignKey("pizzas.id"), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    customizations: Mapped[dict | None] = mapped_column(JSON, nullable=True)

    order = relationship("Order", back_populates="items")
