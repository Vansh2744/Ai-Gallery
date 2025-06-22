from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
import os
from pydantic import BaseModel
from app.utils.schemas import UserCreate
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
import jwt as pyjwt
from fastapi import APIRouter, HTTPException, status
from app.utils.db import engine, Base, SessionLocal
from app.utils.models import User

Base.metadata.create_all(bind=engine)
db = SessionLocal()

load_dotenv()

secret_key = os.getenv("SECRET_KEY")
algorithm = os.getenv("ALGORITHM")

router = APIRouter(tags=["signin"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class Token(BaseModel):
    access_token:str
    token_type:str

class TokenData(BaseModel):
    email: str | None = None

class UserInDB(UserCreate):
    hashed_password:str

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_user(email: str):
    return db.query(User).filter(User.email == email).first()
    
def authenticate_user(email: str, password: str):
    user = get_user(email)
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = pyjwt.encode(to_encode, secret_key, algorithm=algorithm)
    return encoded_jwt

@router.post("/signin")
async def login_for_access_token(
    form_data: UserCreate,
) -> Token:
    user = authenticate_user(form_data.email, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(days=30)
    access_token = create_access_token(
        data={"id":user.id, "email": user.email}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")

@router.get("/getCurrentUser/{token}")
def get_current_user(token:str):
    payload = pyjwt.decode(token, secret_key, algorithms=[algorithm])
    return payload