
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas.admission import AdmissionCreate
from app.services.admission_service import create_admission


router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/admission")

def submit_admission(data: AdmissionCreate, db: Session = Depends(get_db)):
    create_admission(db, data)

    return {"message": "Admission submitted successfully"}

