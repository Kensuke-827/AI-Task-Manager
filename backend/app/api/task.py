from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.schemas.task import TaskCreate, TaskResponse
from app.crud import task as task_crud

router = APIRouter(prefix="/tasks", tags=["Tasks"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=TaskResponse)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    return task_crud.create_task(db, task)


@router.get("/", response_model=list[TaskResponse])
def get_tasks(db: Session = Depends(get_db)):
    return task_crud.get_tasks(db)


@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    task: TaskCreate,
    db: Session = Depends(get_db)
):
    updated_task = task_crud.update_task(db, task_id, task)

    if updated_task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    return updated_task
@router.delete("/{task_id}", response_model=TaskResponse)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    deleted_task = task_crud.delete_task(db, task_id)

    if deleted_task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    return deleted_task