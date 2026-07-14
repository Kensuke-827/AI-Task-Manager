from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    deadline: Optional[datetime] = None
    estimated_hours: Optional[float] = None
    importance: int = 3


class TaskResponse(TaskCreate):
    id: int
    ai_priority: float
    completed: bool

    class Config:
        from_attributes = True