
from sqlalchemy import Column, Integer, String
from app.database import Base

class Admission(Base):
    __tablename__ = "admissions"

    id = Column(Integer, primary_key=True, index=True)
    student_name = Column(String)
    dob = Column(String)
    class_apply = Column(String)
    parent_name = Column(String)
    phone = Column(String)
    email = Column(String, nullable=True)
    address = Column(String, nullable=True)