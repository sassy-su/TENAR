from datetime import datetime

from pydantic import BaseModel, Field

from app.models.compliance import ScreeningStatus


class HealthResponse(BaseModel):
    status: str
    service: str


class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=100)
    password: str = Field(min_length=8)
    full_name: str | None = None


class UserRead(BaseModel):
    id: int
    username: str
    full_name: str | None = None
    is_active: bool

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None


class PartyCreate(BaseModel):
    name: str = Field(min_length=2, max_length=255)
    country: str = Field(min_length=2, max_length=2)
    role: str = "counterparty"


class PartyRead(PartyCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class ProductCreate(BaseModel):
    sku: str = Field(min_length=1, max_length=80)
    description: str
    hs_code: str
    eccn: str | None = None


class ProductRead(ProductCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class ScreeningRequest(BaseModel):
    subject_name: str = Field(min_length=2, max_length=255)
    country: str | None = Field(default=None, min_length=2, max_length=2)
    shipment_reference: str | None = None


class WatchlistHitRead(BaseModel):
    source: str
    matched_name: str
    score: float
    notes: str

    class Config:
        from_attributes = True


class ScreeningRead(BaseModel):
    id: int
    subject_name: str
    country: str | None
    status: ScreeningStatus
    risk_score: float
    rationale: str
    created_at: datetime
    hits: list[WatchlistHitRead] = []

    class Config:
        from_attributes = True


class MonitoringItem(BaseModel):
    id: int
    subject_name: str
    status: ScreeningStatus
    risk_score: float
    rationale: str
    created_at: datetime
