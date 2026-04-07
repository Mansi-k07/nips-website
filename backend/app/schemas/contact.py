
from pydantic import BaseModel

class ContactCreate(BaseModel):
    name: str
    phone: str
    subject: str
    message: str