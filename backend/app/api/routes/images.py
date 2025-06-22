from app.utils.models import ImageModel
from app.utils.schemas import GenerateContent
from app.utils.db import SessionLocal, engine, Base
from fastapi import APIRouter, HTTPException, Depends
from imagekitio import ImageKit
from imagekitio.models.UploadFileRequestOptions import UploadFileRequestOptions
from dotenv import load_dotenv
import os
from sqlalchemy.orm import Session
from google import genai
from google.genai import types
from PIL import Image
from io import BytesIO

load_dotenv()

Base.metadata.create_all(bind=engine)

router = APIRouter(tags=["images"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

url_endpoint = os.getenv("IMAGEKIT_URL_ENDPOINT")

imagekit = ImageKit(
    private_key=os.getenv("IMAGEKIT_PRIVATE_KEY"),
    public_key=os.getenv("IMAGEKIT_PUBLIC_KEY"),
    url_endpoint = url_endpoint
)

ai_api_key = os.getenv("AI_API_KEY")

client = genai.Client(api_key=ai_api_key)

@router.post("/generate-image")
async def upload_image(contents:GenerateContent,db:Session=Depends(get_db)):
 response = client.models.generate_content(
    model="gemini-2.0-flash-preview-image-generation",
    contents=(contents.content),
    config=types.GenerateContentConfig(
      response_modalities=['TEXT', 'IMAGE']
    )
)
 for part in response.candidates[0].content.parts:
  if part.text is not None:
    print(part.text)
  elif part.inline_data is not None:
    image = Image.open(BytesIO((part.inline_data.data)))
    image.save('uploads/gemini-native-image.png')

    file_location = os.path.join("uploads", "gemini-native-image.png")

    options = UploadFileRequestOptions(
        folder="/uploads/"
    )
    
    upload_result = imagekit.upload_file(
        file=open(f"uploads/gemini-native-image.png", "rb"),
        file_name="gemini-native-image.png",
        options=options
    )

    db_image = ImageModel(file_id=upload_result.file_id, name=upload_result.name, url=upload_result.url, owner_id=contents.id)
    db.add(db_image)
    db.commit()
    db.refresh(db_image)

    os.remove(file_location)
    return upload_result

@router.get("/getImages/{id}")
def get_user(id:int, db:Session=Depends(get_db)):
    db_images = db.query(ImageModel).filter(ImageModel.owner_id == id).all()
    return db_images

@router.delete("/delete-image/{file_id}")
def delete_image(file_id:str, db:Session = Depends(get_db)):
    try:
       db_image = db.query(ImageModel).filter(ImageModel.file_id == file_id).first()
       if not db_image:
        raise HTTPException(status_code=404, detail="Image not found")
       
       db.delete(db_image)
       db.commit()

       imagekit.delete_file(file_id)
       return {
          "message":"Image Deleted Successfully"
       }
    except:
       raise HTTPException(status_code=400, detail="Unable to Delete Image")