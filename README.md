# School Management System

A comprehensive school management application built with FastAPI and Next.js.

## Tech Stack
- **Frontend:** Next.js 15 (App Router), Tailwind CSS, TypeScript, Shadcn/ui
- **Backend:** FastAPI, SQLAlchemy, Pydantic, PostgreSQL
- **DevOps:** Docker Compose

## Prerequisites
- Node.js 18+
- Python 3.10+
- Docker & Docker Compose

## Setup Instructions

### 1. Database Setup
Spin up the PostgreSQL database using Docker:
```bash
docker-compose up -d
```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy `.env.example` to `.env` and adjust the variables if necessary.
5. Run the application:
   ```bash
   uvicorn main:app --reload
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` (create it if it doesn't exist).
4. Run the development server:
   ```bash
   npm run dev
   ```

## API Documentation
Once the backend is running, you can access the interactive API docs (Swagger UI) at:
`http://localhost:8000/docs`

## Role-Based Access
- **Admin:** Full access to all modules.
- **Guru:** Manage grades, attendance, and news.
- **Siswa:** View grades, attendance, and news.
