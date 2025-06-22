from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.utils.models import User
from app.utils.schemas import UserResponse, UserCreate
from app.utils.db import engine, Base, SessionLocal
from sqlalchemy.exc import IntegrityError
from passlib.context import CryptContext

Base.metadata.create_all(bind=engine)

router = APIRouter(tags=["signup"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hashed_password(password:str):
    return pwd_context.hash(password)

@router.post("/signup/", response_model=UserResponse)
def signup(user:UserCreate, db:Session=Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User Already Exist"
        )
    try:
        hashed_pass = hashed_password(user.password)
        new_user = User(
            name=user.name,
            email=user.email,
            password=hashed_pass
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not create user"
        )
    
    return new_user