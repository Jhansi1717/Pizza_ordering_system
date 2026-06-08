from contextlib import asynccontextmanager
import time
from sqlalchemy.exc import OperationalError

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import Base, SessionLocal, engine
from app.models import event_log as event_log_models  # noqa: F401
from app.models import order as order_models  # noqa: F401
from app.models.pizza import Pizza
from app.models.user import User
from app.models import preorder as preorder_models  # noqa: F401
from app.models import slot as slot_models  # noqa: F401
from app.models import subscription as subscription_models  # noqa: F401

from app.routes.auth import router as auth_router
from app.routes.chatbot import router as chatbot_router
from app.routes.order import router as order_router
from app.routes.pizza import router as pizza_router
from app.routes.preorder import router as preorder_router
from app.routes.recommendation import router as recommendation_router
from app.routes.subscription import router as subscription_router

from app.services.scheduling_service import initialize_slots


# ---------------- DB INIT WITH RETRY ---------------- #
def init_db_with_retry(retries=5, delay=3):
    for i in range(retries):
        try:
            Base.metadata.create_all(bind=engine)
            print("[SUCCESS] Database connected and tables created")
            return
        except OperationalError as e:
            print(f"[ERROR] DB connection failed (attempt {i+1}): {e}")
            time.sleep(delay)
    print("[FATAL] Could not connect to DB after retries")


# ---------------- SEED DATA ---------------- #
def seed_pizzas():
    db = SessionLocal()
    try:
        existing_count = db.query(Pizza).count()
        if existing_count > 0:
            return

        pizzas = [
            Pizza(name="Margherita", base_type="Thin Crust", prep_time=15, price=199.0),
            Pizza(name="Farmhouse", base_type="Pan", prep_time=18, price=249.0),
            Pizza(name="Pepperoni", base_type="Cheese Burst", prep_time=20, price=299.0),
            Pizza(name="Veggie Delight", base_type="Thin Crust", prep_time=17, price=229.0),
            Pizza(name="BBQ Chicken", base_type="Pan", prep_time=22, price=319.0),
        ]

        db.add_all(pizzas)
        db.commit()
        print("[SUCCESS] Seeded pizzas")

    except Exception as e:
        print("[ERROR] Error seeding pizzas:", e)
    finally:
        db.close()


# ---------------- LIFESPAN ---------------- #
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[START] Starting SliceMind backend...")

    # 1. DB connection (safe)
    init_db_with_retry()

    # 2. Seed data
    seed_pizzas()

    # 3. Initialize slots safely
    db = SessionLocal()
    try:
        initialize_slots(db)
        print("[SUCCESS] Slots initialized")
    except Exception as e:
        print("[ERROR] Slot initialization failed:", e)
    finally:
        db.close()

    yield

    print("[STOP] Shutting down SliceMind backend...")


# ---------------- APP ---------------- #
app = FastAPI(
    title="SliceMind API",
    lifespan=lifespan
)

# ---------------- CORS ---------------- #
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------- ROOT ---------------- #
@app.get("/")
def root():
    return {
        "status": "ok",
        "app": "SliceMind API",
        "docs": "/docs"
    }


# ---------------- ROUTES ---------------- #
app.include_router(auth_router)
app.include_router(pizza_router)
app.include_router(order_router)
app.include_router(subscription_router)
app.include_router(recommendation_router)
app.include_router(preorder_router)
app.include_router(chatbot_router)