from fastapi import FastAPI

from app.database import Base, engine
from app.models import task, event
from app.api.task import router as task_router

# テーブルを作成
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Task Manager")

# Task APIを登録
app.include_router(task_router)

@app.get("/")
def root():
    return {"message": "Hello AI Task Manager"}