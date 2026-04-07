
from sqlalchemy.orm import Session
from app.models.admission import Admission

def create_admission(db: Session, data):
    new_data = Admission(**data.dict())
    db.add(new_data)
    db.commit()
    db.refresh(new_data)

    return new_data
