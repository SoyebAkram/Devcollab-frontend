from typing import Optional
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from auth import create_access_token, get_current_user, hash_password, require_pm, verify_password
from database import Base, SessionLocal, engine, get_db
from models import AuditLog, Bug, Project, Task, User

Base.metadata.create_all(bind=engine)

def get_suggested_solution(title: str = "", description: str = "", stack_trace: str = "") -> str:
    text = f"{title} {description} {stack_trace}".lower()
    if any(k in text for k in ("jwt", "401", "token", "unauthorized")):
        return "Check Authorization: Bearer <token> header, verify JWT_SECRET / expiry on FastAPI, and redirect to /login on 401."
    if any(k in text for k in ("cors", "access-control-allow-origin", "403")):
        return "Add your frontend origin (e.g. GitHub Pages URL & localhost) to FastAPI CORSMiddleware allow_origins."
    if any(k in text for k in ("typeerror", "undefined", "null", "cannot read")):
        return "Use optional chaining (?.) like user?.role and verify state/props initialization before rendering."
    if any(k in text for k in ("alembic", "psycopg", "postgres", "duplicateobject")):
        return "Run 'alembic upgrade head' with checkfirst=True or guard enum creation in your migration script."
    if any(k in text for k in ("overflow", "mobile", "scroll")):
        return "Apply min-w-0, break-words, and overflow-x-hidden on card containers for 390px mobile viewports."
    if any(k in text for k in ("network", "failed to fetch", "404")):
        return "Verify the /api/v1/ endpoint URL, use HashRouter for GitHub Pages, and ensure the backend server is running."
    return "Inspect the stack trace in browser DevTools and wrap async API calls in try/catch with fallback state."

def serialize_bug(b: Bug) -> dict:
    return {
        "id": b.id,
        "title": b.title,
        "description": b.description,
        "priority": b.priority,
        "status": b.status,
        "reported_by": b.reported_by,
        "assigned_to": b.assigned_to,
        "stack_trace": b.stack_trace,
        "auto_detected": b.auto_detected,
        "created_at": b.created_at,
        "suggested_solution": get_suggested_solution(b.title, b.description, b.stack_trace),
    }

def seed_data():
    db = SessionLocal()
    try:
        if db.query(User).count() == 0:
            pm = User(
                name="Soyeb Akram",
                email="soyeb@uits.edu.bd",
                hashed_password=hash_password("devcollab2026"),
                role="Project Manager",
            )
            dev = User(
                name="Shihab Abdullah Shoron",
                email="shihab@uits.edu.bd",
                hashed_password=hash_password("devcollab2026"),
                role="Developer",
            )
            db.add_all([pm, dev])
            db.commit()
            db.refresh(pm)

            p1 = Project(
                name="DevCollab Core Web",
                description="React + FastAPI collaboration platform",
                owner_id=pm.id,
            )
            db.add(p1)
            db.commit()
            db.refresh(p1)

            db.add_all([
                Task(title="Setup JWT Auth & RBAC", priority="HIGH", stage="DONE", assignee="Soyeb Akram", project_id=p1.id),
                Task(title="Build Auto-Detect Bug Tracker", priority="HIGH", stage="REVIEW", assignee="Shihab Shoron", project_id=p1.id),
                Task(title="Connect FastAPI & SQLite", priority="MEDIUM", stage="IN PROGRESS", assignee="Shihab Shoron", project_id=p1.id),
            ])
            db.add(
                Bug(
                    title="401 Unauthorized on Kanban move",
                    description="Expired JWT token on stage update.",
                    priority="HIGH",
                    status="OPEN",
                    reported_by="Auto-Detector",
                    assigned_to="Shihab Shoron",
                    stack_trace="AuthError: JWT token expired",
                    auto_detected=True,
                )
            )
            db.commit()
    finally:
        db.close()

seed_data()

app = FastAPI(title="DevCollab API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://soyebakram.github.io",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def record_audit(db: Session, user: User, action: str, target: str):
    db.add(AuditLog(actor_name=user.name, actor_role=user.role, action=action, target=target))
    db.commit()

class RegisterIn(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "Developer"

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class ProjectIn(BaseModel):
    name: str
    description: str = ""

class TaskIn(BaseModel):
    title: str
    priority: str = "MEDIUM"
    stage: str = "TO DO"
    assignee: str = "Shihab Shoron"
    project_id: Optional[int] = None

class StageIn(BaseModel):
    stage: str

class BugIn(BaseModel):
    title: str
    description: str = ""
    priority: str = "HIGH"
    assigned_to: str = "Shihab Shoron"
    stack_trace: str = ""
    auto_detected: bool = False

@app.get("/api/v1/health")
def health_check():
    return {"status": "ok", "message": "DevCollab Full API Ready!"}

@app.post("/api/v1/auth/register", status_code=201)
def register(payload: RegisterIn, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        name=payload.name,
        email=payload.email,
        hashed_password=hash_password(payload.password),
        role=payload.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"id": user.id, "name": user.name, "email": user.email, "role": user.role}

@app.post("/api/v1/auth/login")
def login(payload: LoginIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token({"sub": user.email, "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user.id, "name": user.name, "email": user.email, "role": user.role},
    }

@app.get("/api/v1/auth/me")
def me(current_user: User = Depends(get_current_user)):
    return {"id": current_user.id, "name": current_user.name, "email": current_user.email, "role": current_user.role}

@app.get("/api/v1/dashboard")
def dashboard_stats(db: Session = Depends(get_db), _user: User = Depends(get_current_user)):
    total_projects = db.query(Project).count()
    total_tasks = db.query(Task).count()
    done_tasks = db.query(Task).filter(Task.stage == "DONE").count()
    open_bugs = db.query(Bug).filter(Bug.status == "OPEN").count()
    resolved_bugs = db.query(Bug).filter(Bug.status == "RESOLVED").count()
    total_users = db.query(User).count()
    velocity = round((done_tasks / total_tasks) * 100) if total_tasks else 0
    return {
        "active_projects": total_projects,
        "sprint_velocity_pct": velocity,
        "open_bugs": open_bugs,
        "resolved_bugs": resolved_bugs,
        "team_collaborators": total_users,
    }

@app.get("/api/v1/projects")
def list_projects(db: Session = Depends(get_db), _user: User = Depends(get_current_user)):
    return db.query(Project).order_by(Project.id.desc()).all()

@app.post("/api/v1/projects", status_code=201)
def create_project(payload: ProjectIn, db: Session = Depends(get_db), pm: User = Depends(require_pm)):
    proj = Project(name=payload.name, description=payload.description, owner_id=pm.id)
    db.add(proj)
    db.commit()
    db.refresh(proj)
    record_audit(db, pm, "CREATE_PROJECT", proj.name)
    return proj

@app.delete("/api/v1/projects/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db), pm: User = Depends(require_pm)):
    proj = db.query(Project).filter(Project.id == project_id).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    name = proj.name
    db.delete(proj)
    db.commit()
    record_audit(db, pm, "DELETE_PROJECT", name)
    return {"deleted": project_id}

@app.get("/api/v1/tasks")
def list_tasks(db: Session = Depends(get_db), _user: User = Depends(get_current_user)):
    return db.query(Task).order_by(Task.id.desc()).all()

@app.post("/api/v1/tasks", status_code=201)
def create_task(payload: TaskIn, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    task = Task(**payload.model_dump())
    db.add(task)
    db.commit()
    db.refresh(task)
    record_audit(db, user, "CREATE_TASK", task.title)
    return task

@app.patch("/api/v1/tasks/{task_id}/stage")
def update_task_stage(task_id: int, payload: StageIn, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task.stage = payload.stage
    db.commit()
    db.refresh(task)
    record_audit(db, user, f"MOVE_TASK -> {payload.stage}", task.title)
    return task

@app.delete("/api/v1/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db), pm: User = Depends(require_pm)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    title = task.title
    db.delete(task)
    db.commit()
    record_audit(db, pm, "DELETE_TASK", title)
    return {"deleted": task_id}

@app.get("/api/v1/bugs")
def list_bugs(db: Session = Depends(get_db), _user: User = Depends(get_current_user)):
    return [serialize_bug(b) for b in db.query(Bug).order_by(Bug.id.desc()).all()]

@app.post("/api/v1/bugs", status_code=201)
def create_bug(payload: BugIn, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    bug = Bug(**payload.model_dump(), reported_by="Auto-Detector" if payload.auto_detected else user.name)
    db.add(bug)
    db.commit()
    db.refresh(bug)
    record_audit(db, user, "REPORT_BUG", bug.title)
    return serialize_bug(bug)

@app.patch("/api/v1/bugs/{bug_id}/toggle")
def toggle_bug(bug_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    bug = db.query(Bug).filter(Bug.id == bug_id).first()
    if not bug:
        raise HTTPException(status_code=404, detail="Bug not found")
    bug.status = "RESOLVED" if bug.status == "OPEN" else "OPEN"
    db.commit()
    db.refresh(bug)
    record_audit(db, user, f"BUG_{bug.status}", bug.title)
    return serialize_bug(bug)

@app.delete("/api/v1/bugs/{bug_id}")
def delete_bug(bug_id: int, db: Session = Depends(get_db), pm: User = Depends(require_pm)):
    bug = db.query(Bug).filter(Bug.id == bug_id).first()
    if not bug:
        raise HTTPException(status_code=404, detail="Bug not found")
    title = bug.title
    db.delete(bug)
    db.commit()
    record_audit(db, pm, "DELETE_BUG", title)
    return {"deleted": bug_id}

@app.get("/api/v1/audit")
def list_audit_logs(db: Session = Depends(get_db), _pm: User = Depends(require_pm)):
    return db.query(AuditLog).order_by(AuditLog.id.desc()).all()