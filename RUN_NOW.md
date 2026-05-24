# 🎯 EXACT STEPS TO RUN YOUR TENAR PROJECT

Follow these steps exactly. Copy and paste each command.

---

## 📍 STEP 1: Open Terminal/Command Prompt

### Windows
Press: `Win + R` → Type: `cmd` → Press Enter

### Mac
Press: `Cmd + Space` → Type: `terminal` → Press Enter

### Linux
Press: `Ctrl + Alt + T`

---

## 📍 STEP 2: Navigate to Your Project

**If you downloaded the ZIP file:**

```bash
cd tenar
```

**If you cloned from GitHub:**

```bash
cd tenar
cd tenar
```

(You should be in the folder where you see `docker-compose.yml`)

**Check you're in the right place:**

```bash
ls
```

You should see:
```
README.md
docker-compose.yml
nginx.conf
.env.example
backend/
frontend/
start.bat
start.sh
```

---

## 📍 STEP 3: Create .env File

### Windows
```bash
copy .env.example .env
```

### Mac/Linux
```bash
cp .env.example .env
```

---

## 📍 STEP 4: RUN THE PROJECT

### **EASIEST - Use the Script**

#### Windows
```bash
start.bat
```

#### Mac/Linux
```bash
chmod +x start.sh
./start.sh
```

A window will open showing the startup process.

---

### **MANUAL - If Script Doesn't Work**

Run this command:

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

---

## 📍 STEP 5: WAIT 30-60 SECONDS

Services are starting. Just wait...

Check if services are ready:

```bash
docker-compose ps
```

Look for all services showing "Up":

```
NAME                COMMAND                  SERVICE      STATUS
tenar_postgres      postgres                 postgres     Up (healthy)
tenar_pgadmin       /entrypoint.sh           pgadmin      Up
tenar_backend       uvicorn app.main:app     backend      Up
tenar_frontend      npm run dev              frontend     Up
tenar_nginx         nginx -g daemon off;     nginx        Up
```

---

## 📍 STEP 6: OPEN YOUR BROWSER

Copy and paste these URLs:

### **Main Application**
```
http://localhost
```

### **API Documentation** (Test your API)
```
http://localhost/docs
```

### **Database Manager** (pgAdmin)
```
http://localhost/pgadmin
```

---

## ✅ YOU'RE DONE!

Your TENAR system is now running!

---

## 🔐 LOGIN TO pgAdmin

1. Go to: **http://localhost/pgadmin**
2. Login with:
   - **Email**: `admin@tenar.com`
   - **Password**: `admin`

---

## 📊 ALL ACCESS POINTS

| What | URL |
|------|-----|
| Main App | http://localhost |
| API Docs | http://localhost/docs |
| pgAdmin | http://localhost/pgadmin |
| API Backend | http://localhost/api |
| Health Check | http://localhost/health |

---

## 🧪 TEST YOUR SYSTEM

### Test 1: Check Frontend Works

```bash
curl http://localhost
```

Should return HTML code.

### Test 2: Check Backend Works

```bash
curl http://localhost/health
```

Should return:
```json
{"status":"healthy","message":"API is running"}
```

### Test 3: Check Database Works

```bash
docker exec tenar_postgres psql -U tenar_user -d tenar_db -c "SELECT 1;"
```

Should return:
```
 ?column?
----------
        1
```

---

## 🛑 TO STOP YOUR PROJECT

When you want to stop everything:

```bash
docker-compose down
```

---

## 🔄 TO RESTART YOUR PROJECT

```bash
docker-compose restart
```

---

## 📋 IF SOMETHING GOES WRONG

### ❌ Services won't start

```bash
docker-compose down -v
docker-compose up -d
```

### ❌ Can't access http://localhost

Wait 60 seconds, then try:

```bash
docker-compose ps
```

All should show "Up". If not, check logs:

```bash
docker-compose logs
```

### ❌ Port 80 already in use

Find what's using it:

**Windows:**
```bash
netstat -ano | findstr :80
```

**Mac/Linux:**
```bash
lsof -i :80
```

Kill the process or change port in `docker-compose.yml`.

### ❌ Docker not installed

Download and install from: https://docs.docker.com/get-docker/

---

## 📝 MAKE CHANGES TO YOUR CODE

### Backend Code
1. Edit files in `backend/app/`
2. Save the file
3. Changes reload automatically (few seconds)
4. Test in http://localhost/docs

### Frontend Code
1. Edit files in `frontend/src/`
2. Save the file
3. Browser refreshes automatically
4. See changes at http://localhost

### Database
1. Go to http://localhost/pgadmin
2. Make changes
3. Changes apply immediately

---

## 🎯 WHAT YOU NOW HAVE

✅ **Backend API** - FastAPI (Python)
✅ **Frontend** - Next.js (React)
✅ **Database** - PostgreSQL
✅ **Database Manager** - pgAdmin
✅ **Reverse Proxy** - Nginx
✅ **All on one localhost!**

---

## 🚀 NEXT STEPS

1. **Explore API** → Visit http://localhost/docs
2. **Create Users** → Use the API to create test data
3. **Manage Database** → Use pgAdmin at http://localhost/pgadmin
4. **Edit Code** → Make changes and see them live
5. **Build Features** → Add compliance tracking features

---

## 💡 USEFUL COMMANDS

```bash
# See what's running
docker-compose ps

# See logs from everything
docker-compose logs -f

# See logs from backend only
docker-compose logs -f backend

# See logs from frontend only
docker-compose logs -f frontend

# Stop everything
docker-compose down

# Stop and delete all data
docker-compose down -v

# Restart everything
docker-compose restart

# Rebuild everything
docker-compose build --no-cache && docker-compose up -d
```

---

## 📞 QUICK REFERENCE

| Need | Command |
|------|---------|
| Start | `docker-compose up -d` |
| Stop | `docker-compose down` |
| Restart | `docker-compose restart` |
| Status | `docker-compose ps` |
| Logs | `docker-compose logs -f` |
| Clean | `docker-compose down -v` |

---

## ✨ THAT'S IT!

**You have successfully:**
- ✅ Set up TENAR
- ✅ Started all services
- ✅ Accessed frontend, backend, and database
- ✅ Got a working development environment

**Happy coding! 🎉**

---

## 📚 Need More Help?

Read these files in your repository:
- `RUNNING_GUIDE.md` - Detailed guide
- `QUICK_START.md` - Quick reference
- `DOCKER_SETUP.md` - Docker help
- `backend/README.md` - Backend info
- `frontend/README.md` - Frontend info
