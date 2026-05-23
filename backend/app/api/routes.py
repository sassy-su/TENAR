from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from jose import JWTError
from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import (
    create_access_token,
    decode_access_token,
    get_password_hash,
    oauth2_scheme,
    verify_password,
)
from app.models.compliance import Party, Product, Screening, ScreeningStatus, User, WatchlistHit
from app.schemas.compliance import (
    HealthResponse,
    MonitoringItem,
    PartyCreate,
    PartyRead,
    ProductCreate,
    ProductRead,
    ScreeningRead,
    ScreeningRequest,
    Token,
    TokenData,
    UserCreate,
    UserRead,
)
from app.services.screening import screen_subject

router = APIRouter()


def get_user(db: Session, username: str) -> User | None:
    return db.scalars(select(User).where(User.username == username)).first()


def authenticate_user(db: Session, username: str, password: str) -> User | None:
    user = get_user(db, username)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_access_token(token)
        username: str | None = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = get_user(db, token_data.username)
    if user is None:
        raise credentials_exception
    return user


def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user")
    return current_user


@router.post("/auth/register", response_model=UserRead, status_code=201)
def register_user(payload: UserCreate, db: Session = Depends(get_db)) -> User:
    if get_user(db, payload.username):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already registered")

    user = User(
        username=payload.username,
        hashed_password=get_password_hash(payload.password),
        full_name=payload.full_name,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/auth/token", response_model=Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
) -> Token:
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/users/me", response_model=UserRead)
def read_users_me(current_user: User = Depends(get_current_active_user)) -> User:
    return current_user


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(status="ok", service="tenar-api")


@router.post("/parties", response_model=PartyRead, status_code=201)
def create_party(payload: PartyCreate, db: Session = Depends(get_db)) -> Party:
    party = Party(**payload.model_dump())
    db.add(party)
    db.commit()
    db.refresh(party)
    return party


@router.get("/parties", response_model=list[PartyRead])
def list_parties(db: Session = Depends(get_db)) -> list[Party]:
    return list(db.scalars(select(Party).order_by(desc(Party.created_at))).all())


@router.post("/products", response_model=ProductRead, status_code=201)
def create_product(payload: ProductCreate, db: Session = Depends(get_db)) -> Product:
    product = Product(**payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.get("/products", response_model=list[ProductRead])
def list_products(db: Session = Depends(get_db)) -> list[Product]:
    return list(db.scalars(select(Product).order_by(desc(Product.created_at))).all())


@router.post("/screenings", response_model=ScreeningRead, status_code=201)
def create_screening(
    payload: ScreeningRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Screening:
    decision = screen_subject(payload.subject_name, payload.country)
    screening = Screening(
        subject_name=payload.subject_name,
        country=payload.country.upper() if payload.country else None,
        status=decision.status,
        risk_score=decision.risk_score,
        rationale=decision.rationale,
    )
    screening.hits = [WatchlistHit(**hit) for hit in decision.hits]

    db.add(screening)
    db.commit()
    db.refresh(screening)
    return screening


@router.get("/screenings", response_model=list[ScreeningRead])
def list_screenings(db: Session = Depends(get_db)) -> list[Screening]:
    return list(db.scalars(select(Screening).order_by(desc(Screening.created_at))).all())


@router.get("/monitoring", response_model=list[MonitoringItem])
def monitoring_queue(db: Session = Depends(get_db)) -> list[Screening]:
    statement = (
        select(Screening)
        .where(Screening.status.in_([ScreeningStatus.review, ScreeningStatus.blocked]))
        .order_by(desc(Screening.risk_score), desc(Screening.created_at))
    )
    return list(db.scalars(statement).all())
