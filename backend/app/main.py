from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.models import task, event
from app.api.task import router as task_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Task Manager")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://ai-task-manager-frontend-3j86.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(task_router)


@app.get("/")
def root():
    return {"message": "Hello AI Task Manager"}