# 🚀 RUNNING YOUR TENAR PROJECT - STEP BY STEP

## 📋 System Requirements Check

Before starting, verify you have:

```bash
# Check Docker
docker --version
# Expected: Docker version 20.x or higher

# Check Docker Compose
docker-compose --version
# Expected: Docker Compose version 1.29 or higher

# Check Git
git --version
# Expected: git version 2.x or higher
```

If any are missing, install them first:
- **Docker**: https://docs.docker.com/get-docker/
- **Docker Compose**: https://docs.docker.com/compose/install/
- **Git**: https://git-scm.com/

---

## ⚙️ AUTOMATED START (Recommended)

### **Windows Users**

1. **Open Command Prompt** (Press `Win + R`, type `cmd`, press Enter)

2. **Navigate to project:**
```bash
cd path\to\tenar
```

3. **Run the start script:**
```bash
start.bat
```

4. **Wait 30-60 seconds** for services to initialize

5. **Open Browser:**
```
http://localhost
```

---

### **Mac/Linux Users**

1. **Open Terminal**

2. **Navigate to project:**
```bash
cd path/to/tenar
```

3. **Make script executable:**
```bash
chmod +x start.sh
```

4. **Run the start script:**
```bash
./start.sh
```

5. **Wait 30-60 seconds** for services to initialize

6. **Open Browser:**
```
http://localhost
```

---

## 📝 MANUAL START (If Scripts Don't Work)

### **Step 1: Clone Repository**

```bash
git clone https://github.com/sassy-su/tenar.git
cd tenar
git checkout develop
```

### **Step 2: Create Environment File**

```bash
cp .env.example .env
```

### **Step 3: Start Docker Services**

```bash
docker-compose up -d
```

Expected output:
```
Creating network "tenar_tenar_network" with driver "bridge"
Creating tenar_postgres ... done
Creating tenar_backend ... done
Creating tenar_frontend ... done
Creating tenar_pgadmin ... done
Creating tenar_nginx ... done
```

### **Step 4: Wait for Services**

```bash
docker-compose ps
```

Wait until all shows "Up":
```
NAME                STATUS
tenar_postgres      Up (healthy)
tenar_backend       Up
tenar_frontend      Up
tenar_pgadmin       Up
tenar_nginx         Up
```

### **Step 5: Open Browser**

Visit:
```
http://localhost
```

---

## 🌐 WHAT YOU'LL SEE

### **Main Application** (http://localhost)
- Home page with TENAR branding
- Feature overview
- Navigation to other sections

### **API Documentation** (http://localhost/docs)
- Interactive Swagger UI
- Test API endpoints
- View all available routes

### **Database Manager** (http://localhost/pgadmin)
- Login with: admin@tenar.com / admin
- View and manage database
- Create tables, run queries

### **API Backend** (http://localhost/api)
- REST API endpoints
- Health check: http://localhost/health

---

## ✅ VERIFICATION CHECKLIST

After starting, verify everything works:

### ✔️ Check Frontend
```bash
curl http://localhost
# Should return HTML page
```

### ✔️ Check Backend Health
```bash
curl http://localhost/health
# Should return: {"status":"healthy","message":"API is running"}
```

### ✔️ Check Database
```bash
docker exec tenar_postgres psql -U tenar_user -d tenar_db -c "SELECT 1;"
# Should return: 1
```

### ✔️ Check All Services
```bash
docker-compose ps
# All should be "Up"
```

---

## 🎯 QUICK ACCESS GUIDE

| Purpose | URL | Username | Password |
|---------|-----|----------|----------|
| **Main App** | http://localhost | - | - |
| **API Docs** | http://localhost/docs | - | - |
| **Database Manager** | http://localhost/pgadmin | admin@tenar.com | admin |
| **Database Connection** | localhost:5432 | tenar_user | tenar_password |

---

## 🔄 COMMON OPERATIONS

### **View All Logs**
```bash
docker-compose logs -f
```

### **View Specific Service Logs**
```bash
# Backend logs
docker-compose logs -f backend

# Frontend logs
docker-compose logs -f frontend

# Database logs
docker-compose logs -f postgres

# All logs with timestamps
docker-compose logs -f --timestamps
```

### **Restart Services**
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
docker-compose restart frontend
```

### **Stop Services**
```bash
docker-compose down
```

### **Stop and Clean Data**
```bash
docker-compose down -v
```

### **Rebuild Services**
```bash
docker-compose build --no-cache
docker-compose up -d
```

### **Check Service Status**
```bash
docker-compose ps
```

---

## 🐛 TROUBLESHOOTING

### ❌ Services won't start

**Solution 1: Check Docker is running**
```bash
docker ps
# If error, open Docker Desktop/daemon
```

**Solution 2: Check ports aren't in use**
```bash
# Windows
netstat -ano | findstr :80

# Mac/Linux
lsof -i :80
```

**Solution 3: Rebuild everything**
```bash
docker-compose down -v
docker-compose up -d
```

---

### ❌ Can't access http://localhost

**Wait longer** - Services take 30-60 seconds to initialize

**Check services status:**
```bash
docker-compose ps
```

**View logs for errors:**
```bash
docker-compose logs
```

---

### ❌ Database connection error

**Check PostgreSQL is running:**
```bash
docker-compose logs postgres
```

**Test database connection:**
```bash
docker exec tenar_postgres psql -U tenar_user -d tenar_db -c "SELECT 1;"
```

**Restart database:**
```bash
docker-compose restart postgres
```

---

### ❌ Frontend/Backend not communicating

**Check backend is accessible:**
```bash
curl http://localhost:8000/health
```

**Check CORS settings:**
```bash
docker exec tenar_backend env | grep ALLOWED
```

**Restart backend:**
```bash
docker-compose restart backend
```

---

### ❌ pgAdmin can't connect to database

1. Go to: http://localhost/pgadmin
2. Login: admin@tenar.com / admin
3. Add new server:
   - **Hostname**: postgres
   - **Port**: 5432
   - **Username**: tenar_user
   - **Password**: tenar_password
   - **Database**: tenar_db

---

## 💾 DATABASE MANAGEMENT

### **Connect via CLI**
```bash
docker exec -it tenar_postgres psql -U tenar_user -d tenar_db
```

### **View all tables**
```bash
docker exec tenar_postgres psql -U tenar_user -d tenar_db -c "\dt"
```

### **View table structure**
```bash
docker exec tenar_postgres psql -U tenar_user -d tenar_db -c "\d users"
```

### **Run SQL query**
```bash
docker exec tenar_postgres psql -U tenar_user -d tenar_db -c "SELECT * FROM users;"
```

### **Backup database**
```bash
docker exec tenar_postgres pg_dump -U tenar_user tenar_db > backup.sql
```

### **Restore database**
```bash
docker exec -i tenar_postgres psql -U tenar_user tenar_db < backup.sql
```

---

## 🧪 TEST YOUR API

### **Create a User**
```bash
curl -X POST "http://localhost/api/v1/users/" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@tenar.com",
    "username": "testuser",
    "full_name": "Test User",
    "password": "TestPassword123"
  }'
```

### **Get All Users**
```bash
curl "http://localhost/api/v1/users/"
```

### **Health Check**
```bash
curl "http://localhost/health"
```

---

## 📊 DEVELOPMENT WORKFLOW

### **Making Backend Changes**

1. Edit files in `backend/app/`
2. Save file
3. Uvicorn auto-reloads (few seconds)
4. Test in Swagger UI: http://localhost/docs

### **Making Frontend Changes**

1. Edit files in `frontend/src/`
2. Save file
3. Browser auto-refreshes (few seconds)
4. Changes visible at: http://localhost

### **Database Changes**

1. Connect to pgAdmin: http://localhost/pgadmin
2. Create/modify tables
3. Changes take effect immediately

---

## 🧹 CLEANUP

### **Stop Services Without Deleting Data**
```bash
docker-compose down
```

### **Stop Services and Delete Everything**
```bash
docker-compose down -v
```

### **Remove Unused Images**
```bash
docker image prune -a
```

### **Clear Docker Cache**
```bash
docker system prune -a
```

---

## 📚 NEXT STEPS

After successfully running:

1. ✅ **Explore API** - Visit http://localhost/docs
2. ✅ **Check Frontend** - Visit http://localhost
3. ✅ **Manage DB** - Visit http://localhost/pgadmin
4. ✅ **Start Coding** - Make changes and see them live
5. ✅ **Read Docs** - Check `HOW_TO_RUN.md` for details

---

## 🆘 NEED MORE HELP?

### **Check These Files:**
- `HOW_TO_RUN.md` - Complete detailed guide
- `DOCKER_SETUP.md` - Docker-specific help
- `backend/README.md` - Backend documentation
- `frontend/README.md` - Frontend documentation

### **Check Logs:**
```bash
docker-compose logs -f
```

### **Still Stuck?**
- Check if all prerequisites are installed
- Restart Docker
- Try: `docker-compose down -v && docker-compose up -d`

---

## 🎉 CONGRATULATIONS!

You now have a fully running:
- ✅ FastAPI Backend
- ✅ Next.js Frontend
- ✅ PostgreSQL Database
- ✅ pgAdmin Interface
- ✅ Nginx Reverse Proxy

**All on localhost with unified access!**

Happy coding! 🚀
