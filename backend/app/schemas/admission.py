
from pydantic import BaseModel

class AdmissionCreate(BaseModel):
    student_name: str
    dob: str
    class_apply: str
    parent_name: str
    phone: str
    email: str  | None = None
    address: str  | None = None
