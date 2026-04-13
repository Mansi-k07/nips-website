

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine

# ROUTES
from app.routes import admission, contact

# MODELS (for DB creation)
from app.models import admission as admission_mddel
from app.models import contact as contact_model


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://newidealpublicschool.netlify.app/",     # your live Netlify site
        "http://localhost:5500",                         # VS Code Live Server
        "http://127.0.0.1:5500",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "null",                                
    ], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Create tables
Base.metadata.create_all(bind=engine)

# Include routes
app.include_router(admission.router)
app.include_router(contact.router)


@app.get("/")

def home():

    return {"message": "School Backend Running"}