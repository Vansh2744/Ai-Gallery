from pydantic import BaseModel


class ImageCreate(BaseModel):
    file_id:str
    name:str
    url:str

class ImageResponse(ImageCreate):
    id:int
    owner_id:int

    class Config:
        orm_mode = True

class UserCreate(BaseModel):
    name:str | None = None
    email:str
    password:str

class UserResponse(UserCreate):
    id:int
    images:list[ImageCreate] = []

    class Config:
        orm_mode = True

class GenerateContent(BaseModel):
    id:int
    content:str