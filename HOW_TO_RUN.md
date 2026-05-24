# 🚀 TENAR - How to Run Your Project

Complete step-by-step guide to run the entire TENAR system locally.

## Prerequisites

Before starting, make sure you have:

- ✅ **Docker** - [Install Docker](https://docs.docker.com/get-docker/)
- ✅ **Docker Compose** - [Install Docker Compose](https://docs.docker.com/compose/install/)
- ✅ **Git** - [Install Git](https://git-scm.com/)
- ✅ **4GB RAM** minimum (8GB recommended)
- ✅ **2 CPU cores** minimum (4 cores recommended)

## Method 1: Docker (Recommended - Easiest)

### Step 1: Clone the Repository

```bash
git clone https://github.com/sassy-su/tenar.git
cd tenar
```

### Step 2: Switch to Development Branch

```bash
git checkout develop
```

### Step 3: Create Environment File

```bash
cp .env.example .env
```

The `.env` file contains all configuration. Default values work for local development:

```env
POSTGRES_USER=tenar_user
POSTGRES_PASSWORD=tenar_password
POSTGRES_DB=tenar_db
PGADMIN_EMAIL=admin@tenar.com
PGADMIN_PASSWORD=admin
DEBUG=True
```

### Step 4: Start All Services with Docker Compose

```bash
docker-compose up -d
```

This command will:
- ✅ Pull required images
- ✅ Build backend image
- ✅ Build frontend image
- ✅ Start PostgreSQL
- ✅ Start pgAdmin
- ✅ Start FastAPI backend
- ✅ Start Next.js frontend
- ✅ Start Nginx reverse proxy

### Step 5: Wait for Services to Initialize

```bash
docker-compose ps
```

Expected output:
```
NAME                COMMAND                  SERVICE      STATUS
tenar_postgres      postgres                 postgres     Up (healthy)
tenar_pgadmin       /entrypoint.sh           pgadmin      Up
tenar_backend       uvicorn app.main:app     backend      Up
tenar_frontend      npm run dev              frontend     Up
tenar_nginx         nginx -g daemon off;     nginx        Up
```

Wait 30-60 seconds for all services to be healthy.

### Step 6: Access Your Application

Open your browser and visit:

| Service | URL |
|---------|-----|
| **Main App** | http://localhost |
| **API Docs** | http://localhost/docs |
| **Database Manager** | http://localhost/pgadmin |

That's it! 🎉

---

## Method 2: Local Development (Without Docker)

Use this if you prefer running services individually or don't have Docker.

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 14+

### Step 1: Clone Repository

```bash
git clone https://github.com/sassy-su/tenar.git
cd tenar
git checkout develop
```

### Step 2: Setup PostgreSQL

#### Windows/Mac/Linux
Install PostgreSQL 14+ and create database:

```bash
# Connect to PostgreSQL
psql -U postgres

# In psql prompt, run:
CREATE USER tenar_user WITH PASSWORD 'tenar_password';
CREATE DATABASE tenar_db OWNER tenar_user;
GRANT ALL PRIVILEGES ON DATABASE tenar_db TO tenar_user;
\q
```

### Step 3: Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
```

Edit `backend/.env`:
```env
DATABASE_URL=postgresql://tenar_user:tenar_password@localhost:5432/tenar_db
DEBUG=True
SECRET_KEY=your-secret-key-change-in-production
```

Start backend:
```bash
uvicorn app.main:app --reload
```

Backend will be available at: **http://localhost:8000**

### Step 4: Setup Frontend (New Terminal)

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local
cp .env.example .env.local
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start frontend:
```bash
npm run dev
```

Frontend will be available at: **http://localhost:3000**

### Step 5: Setup pgAdmin (Optional - New Terminal)

If you want pgAdmin GUI for database management:

```bash
# Using Docker only for pgAdmin
docker run -p 5050:80 \
  -e PGADMIN_DEFAULT_EMAIL=admin@tenar.com \
  -e PGADMIN_DEFAULT_PASSWORD=admin \
  dpage/pgadmin4
```

Access pgAdmin at: **http://localhost:5050**

---

## 📊 Running Services Summary

### Docker Method
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Restart services
docker-compose restart
```

### Local Method
```bash
# Terminal 1 - Backend
cd backend && source venv/bin/activate && uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd frontend && npm run dev

# Terminal 3 - pgAdmin (optional)
docker run -p 5050:80 -e PGADMIN_DEFAULT_EMAIL=admin@tenar.com -e PGADMIN_DEFAULT_PASSWORD=admin dpage/pgadmin4
```

---

## 🌐 Access Points

After services are running, access:

### Docker Setup
| Service | URL |
|---------|-----|
| Frontend | http://localhost |
| Backend API | http://localhost/api |
| API Documentation | http://localhost/docs |
| pgAdmin | http://localhost/pgadmin |

### Local Setup
| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Documentation | http://localhost:8000/docs |
| pgAdmin | http://localhost:5050 |

---

## 🔑 Default Credentials

### pgAdmin
```
Email: admin@tenar.com
Password: admin
```

### PostgreSQL
```
Host: localhost (or postgres if using Docker)
Port: 5432
Username: tenar_user
Password: tenar_password
Database: tenar_db
```

---

## 🧪 Test Your Setup

### Check Frontend
```bash
curl http://localhost:3000
# Or visit in browser: http://localhost:3000
```

### Check Backend Health
```bash
curl http://localhost:8000/health
# Response: {"status":"healthy","message":"API is running"}
```

### Check API Docs
```bash
# Visit in browser: http://localhost:8000/docs
```

### Check Database Connection
```bash
# Docker method
docker exec tenar_postgres psql -U tenar_user -d tenar_db -c "SELECT 1;"

# Local method
psql -U tenar_user -d tenar_db -c "SELECT 1;"
```

---

## 📋 Useful Commands

### Docker Commands

```bash
# View running containers
docker-compose ps

# View logs from all services
docker-compose logs -f

# View logs from specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
docker-compose logs -f nginx

# Stop all services
docker-compose down

# Stop and remove volumes (clean database)
docker-compose down -v

# Rebuild images
docker-compose build --no-cache

# Start fresh
docker-compose down -v && docker-compose up -d

# Execute command in container
docker exec -it tenar_backend bash
docker exec -it tenar_frontend bash
docker exec -it tenar_postgres psql -U tenar_user -d tenar_db
```

### Backend Commands (Local)

```bash
# Activate virtual environment
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Run server
uvicorn app.main:app --reload

# Run tests
pytest

# Run tests with coverage
pytest --cov

# Deactivate environment
deactivate
```

### Frontend Commands (Local)

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Run tests
npm test
```

---

## 🐛 Troubleshooting

### Services Won't Start

**Check if ports are already in use:**

```bash
# Linux/Mac
lsof -i :80    # Nginx
lsof -i :8000  # Backend
lsof -i :3000  # Frontend
lsof -i :5432  # PostgreSQL
lsof -i :5050  # pgAdmin

# Windows
netstat -ano | findstr :80
netstat -ano | findstr :8000
netstat -ano | findstr :3000
```

**Solution:** Change ports in `docker-compose.yml` or stop conflicting services.

### Database Connection Error

**Check database is running:**
```bash
docker-compose logs postgres
```

**Wait 30-60 seconds** for PostgreSQL to fully initialize.

**Verify credentials in `.env` file** match what you set up.

### Frontend Can't Connect to Backend

**Check CORS is configured:**
```bash
docker-compose logs nginx
```

**Verify `ALLOWED_ORIGINS` in `.env`:**
```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000,http://localhost
```

### pgAdmin Can't Access Database

**Add connection in pgAdmin:**
1. Go to http://localhost/pgadmin (or :5050 for local)
2. Click "Add New Server"
3. **General Tab:**
   - Name: tenar_local
4. **Connection Tab:**
   - Host: postgres (Docker) or localhost (Local)
   - Port: 5432
   - Username: tenar_user
   - Password: tenar_password
   - Database: tenar_db
5. Click "Save"

### Docker Out of Memory

**Increase Docker memory:**
- **Docker Desktop**: Preferences → Resources → Memory
- Allocate at least 4GB

### Port Already in Use

**Find and stop the process:**

```bash
# Linux/Mac - Stop process using port 80
lsof -i :80 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Or change port in docker-compose.yml
# Change "80:80" to "8080:80"
```

---

## 📚 First Steps After Running

### 1. Verify API Documentation

Visit: **http://localhost:8000/docs** (or http://localhost/docs)

You'll see all available API endpoints with interactive testing.

### 2. Connect to Database

**Using pgAdmin:**
- Go to http://localhost/pgadmin
- Login with admin@tenar.com / admin
- Add PostgreSQL server connection

**Using CLI:**
```bash
docker exec -it tenar_postgres psql -U tenar_user -d tenar_db
```

### 3. Create Test Data

```bash
curl -X POST "http://localhost:8000/api/v1/users/" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@tenar.com",
    "username": "testuser",
    "full_name": "Test User",
    "password": "testpassword123"
  }'
```

### 4. Check Frontend

Visit: **http://localhost:3000** (or http://localhost for Docker)

You should see the TENAR home page.

---

## 🔄 Development Workflow

### Making Backend Changes

1. Edit files in `backend/app/`
2. Save file
3. Check backend logs: `docker-compose logs -f backend`
4. Changes auto-reload (Uvicorn reload mode)
5. Test in Swagger UI: http://localhost:8000/docs

### Making Frontend Changes

1. Edit files in `frontend/src/`
2. Save file
3. Browser auto-refreshes (Next.js hot reload)
4. Check frontend logs: `docker-compose logs -f frontend`

### Database Changes

1. Connect via pgAdmin: http://localhost/pgadmin
2. Or use CLI: `docker exec -it tenar_postgres psql -U tenar_user -d tenar_db`
3. Changes take effect immediately

---

## 📦 Project Structure

```
tenar/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── main.py         # Entry point
│   │   ├── config.py       # Configuration
│   │   ├── database.py     # Database setup
│   │   ├── models/         # Database models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── routes/         # API routes
│   │   └── services/       # Business logic
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile
│
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # App directory
│   │   ├── components/    # React components
│   │   ├── utils/         # Utilities
│   │   └── store/         # State management
│   ├── package.json       # npm dependencies
│   └── Dockerfile
│
├── docker-compose.yml     # Docker orchestration
├── nginx.conf             # Nginx configuration
├── .env.example          # Environment template
└── README.md             # Project documentation
```

---

## 🎯 Next Steps

After successfully running the project:

1. **Explore API Documentation**: http://localhost:8000/docs
2. **Check Frontend**: http://localhost:3000
3. **Connect to Database**: pgAdmin at http://localhost/pgadmin
4. **Create API Routes**: Add endpoints in `backend/app/routes/`
5. **Build UI Components**: Add pages in `frontend/src/app/`
6. **Add Features**: Implement compliance monitoring features

---

## 💡 Tips

- Keep `.env` file secrets secure - never commit to Git
- Use `docker-compose logs -f` to monitor all services
- Press `Ctrl+C` to stop following logs
- Use `docker-compose down` to stop all services properly
- Keep Docker and images updated

---

## 📞 Need Help?

Check these files for more information:
- `DOCKER_SETUP.md` - Detailed Docker setup
- `backend/README.md` - Backend documentation
- `frontend/README.md` - Frontend documentation

---

**Your project is ready to go! 🚀**

Choose your method above and start developing!
