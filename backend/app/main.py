from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select

from app.api.routes import router
from app.core.config import settings
from app.core.database import Base, SessionLocal, engine
from app.core.security import get_password_hash
from app.models.compliance import User


def create_app() -> FastAPI:
    app = FastAPI(
        title="TENAR API",
        summary="AI-powered export compliance and monitoring system",
        version="0.1.0",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        if not db.scalars(select(User).where(User.username == "admin")).first():
            db.add(
                User(
                    username="admin",
                    hashed_password=get_password_hash("admin123"),
                    full_name="Admin User",
                )
            )
            db.commit()

    app.include_router(router, prefix="/api")
    return app


app = create_app()
