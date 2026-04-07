

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas.contact import ContactCreate
from app.services.contact_service import create_contact


router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/contact")

def submit_contact(data: ContactCreate, db: Session = Depends(get_db)):
    create_contact(db, data)

    return {"message": "Message sent successfully"}