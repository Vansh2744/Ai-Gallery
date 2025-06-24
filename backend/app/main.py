from fastapi import FastAPI
from app.api.main import api_router
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from mangum import Mangum

load_dotenv()

app = FastAPI()
handler = Mangum(app)

SECRET_KEY=os.getenv("SECRET_KEY")
ALGORITHM=os.getenv("ALGORITHM")

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["https://ai-gallery-frontend.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)
