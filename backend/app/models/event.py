from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from app.database import Base


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    location = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
    