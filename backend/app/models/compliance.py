from datetime import datetime
from enum import Enum

from sqlalchemy import Boolean
from sqlalchemy import DateTime
from sqlalchemy import Enum as SqlEnum
from sqlalchemy import Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class ScreeningStatus(str, Enum):
    clear = "clear"
    review = "review"
    blocked = "blocked"


class Party(Base):
    __tablename__ = "parties"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), index=True)
    country: Mapped[str] = mapped_column(String(2), index=True)
    role: Mapped[str] = mapped_column(String(50), default="counterparty")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    full_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sku: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    description: Mapped[str] = mapped_column(Text)
    hs_code: Mapped[str] = mapped_column(String(20), index=True)
    eccn: Mapped[str | None] = mapped_column(String(30), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Shipment(Base):
    __tablename__ = "shipments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    reference: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    origin_country: Mapped[str] = mapped_column(String(2), index=True)
    destination_country: Mapped[str] = mapped_column(String(2), index=True)
    exporter_id: Mapped[int | None] = mapped_column(ForeignKey("parties.id"), nullable=True)
    consignee_id: Mapped[int | None] = mapped_column(ForeignKey("parties.id"), nullable=True)
    product_id: Mapped[int | None] = mapped_column(ForeignKey("products.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    exporter: Mapped[Party | None] = relationship(foreign_keys=[exporter_id])
    consignee: Mapped[Party | None] = relationship(foreign_keys=[consignee_id])
    product: Mapped[Product | None] = relationship()


class Screening(Base):
    __tablename__ = "screenings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    subject_name: Mapped[str] = mapped_column(String(255), index=True)
    country: Mapped[str | None] = mapped_column(String(2), nullable=True)
    status: Mapped[ScreeningStatus] = mapped_column(SqlEnum(ScreeningStatus), index=True)
    risk_score: Mapped[float] = mapped_column(Float, default=0.0)
    rationale: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    hits: Mapped[list["WatchlistHit"]] = relationship(back_populates="screening", cascade="all, delete-orphan")


class WatchlistHit(Base):
    __tablename__ = "watchlist_hits"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    screening_id: Mapped[int] = mapped_column(ForeignKey("screenings.id"))
    source: Mapped[str] = mapped_column(String(120))
    matched_name: Mapped[str] = mapped_column(String(255))
    score: Mapped[float] = mapped_column(Float)
    notes: Mapped[str] = mapped_column(Text)

    screening: Mapped[Screening] = relationship(back_populates="hits")
