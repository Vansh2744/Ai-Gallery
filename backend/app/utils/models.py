from sqlalchemy import String, Integer, Column, ForeignKey, Boolean
from app.utils.db import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, unique=True, index=True)
    name = Column(String)
    email = Column(String, unique=True)
    password = Column(String)

    images = relationship("ImageModel", back_populates="owner")

    isValidToGenerateImage = Column(Boolean, default=True)

class ImageModel(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, unique=True, index=True)
    file_id = Column(String, unique=True)
    name = Column(String)
    url = Column(String)

    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="images")

