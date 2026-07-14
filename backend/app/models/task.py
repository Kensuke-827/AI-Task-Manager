from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Boolean
from datetime import datetime

from app.database import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    deadline = Column(DateTime)
    estimated_hours = Column(Float)
    importance = Column(Integer, default=3)
    ai_priority = Column(Float, default=0.0)
    completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )