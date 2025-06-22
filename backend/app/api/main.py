from fastapi import APIRouter
from app.api.routes import signup, signin, images

api_router = APIRouter()

api_router.include_router(signup.router)
api_router.include_router(signin.router)
api_router.include_router(images.router)