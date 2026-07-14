from sqlalchemy.orm import Session
from app.models.task import Task
from app.schemas.task import TaskCreate


def get_tasks(db: Session):
    return db.query(Task).order_by(Task.id.asc()).all()


def create_task(db: Session, task: TaskCreate):
    new_task = Task(
        title=task.title,
        description=task.description,
        deadline=task.deadline,
        estimated_hours=task.estimated_hours,
        importance=task.importance,
        ai_priority=calculate_priority(task),
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task


def update_task(db: Session, task_id: int, task: TaskCreate):
    existing_task = db.query(Task).filter(Task.id == task_id).first()

    if existing_task is None:
        return None

    existing_task.title = task.title
    existing_task.description = task.description
    existing_task.deadline = task.deadline
    existing_task.estimated_hours = task.estimated_hours
    existing_task.importance = task.importance
    existing_task.ai_priority = calculate_priority(task)

    db.commit()
    db.refresh(existing_task)

    return existing_task
def delete_task(db: Session, task_id: int):
    existing_task = db.query(Task).filter(Task.id == task_id).first()

    if existing_task is None:
        return None

    db.delete(existing_task)
    db.commit()

    return existing_task
from app.services.priority import calculate_priority