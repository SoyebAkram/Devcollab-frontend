from datetime import datetime, timezone
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text
from database import Base

def utcnow():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(180), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(40), default="Developer", nullable=False)
    created_at = Column(DateTime, default=utcnow)

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(160), nullable=False)
    description = Column(Text, default="")
    status = Column(String(40), default="ACTIVE")
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=utcnow)

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    priority = Column(String(20), default="MEDIUM")
    stage = Column(String(30), default="TO DO")
    assignee = Column(String(120), default="Shihab Shoron")
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    created_at = Column(DateTime, default=utcnow)

class Bug(Base):
    __tablename__ = "bugs"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(220), nullable=False)
    description = Column(Text, default="")
    priority = Column(String(20), default="HIGH")
    status = Column(String(20), default="OPEN")
    reported_by = Column(String(120), default="Auto-Detector")
    assigned_to = Column(String(120), default="Shihab Shoron")
    stack_trace = Column(Text, default="")
    auto_detected = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    actor_name = Column(String(120), nullable=False)
    actor_role = Column(String(40), nullable=False)
    action = Column(String(120), nullable=False)
    target = Column(String(200), nullable=False)
    created_at = Column(DateTime, default=utcnow)