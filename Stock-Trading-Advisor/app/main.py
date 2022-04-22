from fastapi import FastAPI

from app.db.init_db import init_db
from app.db.session import SessionLocal

from app.core.config import settings
from app.api.api_v1.api import api_router

"""
For start up command and some settings
"""

app = FastAPI()

@app.on_event("startup")
async def startup_event():
    # Initialize db
    db = SessionLocal()
    init_db(db)

    
@app.get("/")
def hello():
    return {"message":"Server is running !!"}

from fastapi.middleware.cors import CORSMiddleware
# origins = [
#     "http://localhost:3000",
# ]
app.add_middleware(
    CORSMiddleware,
    # allow_origins=origins,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(api_router, prefix=settings.API_V1_STR)