
from sqlalchemy.orm import Session
from app.models.contact import Contact

def create_contact(db: Session, data):
    new_data = Contact(**data.dict())
    db.add(new_data)
    db.commit()
    db.refresh(new_data)

    return new_data
