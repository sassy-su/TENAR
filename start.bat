@echo off
REM TENAR - Quick Start Script for Windows
REM This script automates the setup and running of the TENAR project

echo.
echo ==========================================
echo    TENAR - AI Export Compliance System
echo ==========================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed. Please install Docker first.
    echo Visit: https://docs.docker.com/get-docker/
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    echo Visit: https://docs.docker.com/compose/install/
    pause
    exit /b 1
)

echo ✅ Docker and Docker Compose are installed
echo.

REM Check if .env file exists
if not exist ".env" (
    echo 📝 Creating .env file from .env.example...
    copy .env.example .env
    echo ✅ .env file created
) else (
    echo ✅ .env file already exists
)

echo.
echo 🚀 Starting TENAR services with Docker Compose...
echo.

REM Pull latest images
echo 📦 Pulling latest Docker images...
docker-compose pull

REM Build and start services
echo.
echo 🔨 Building and starting services...
docker-compose up -d

echo.
echo ⏳ Waiting for services to initialize (30-60 seconds)...
echo.

REM Simple wait
timeout /t 30 /nobreak

echo.
echo ==========================================
echo    🎉 TENAR is now running!
echo ==========================================
echo.
echo 📍 Access your application at:
echo.
echo   🌐 Frontend:      http://localhost
echo   🔌 Backend API:   http://localhost/api
echo   📚 API Docs:      http://localhost/docs
echo   🗄️  Database GUI:  http://localhost/pgadmin
echo.
echo 🔑 pgAdmin Credentials:
echo   Email:    admin@tenar.com
echo   Password: admin
echo.
echo 📊 Database Credentials:
echo   Host:     postgres (or localhost:5432)
echo   User:     tenar_user
echo   Password: tenar_password
echo   Database: tenar_db
echo.
echo ==========================================
echo 📋 Useful Commands:
echo ==========================================
echo.
echo View logs:
echo   docker-compose logs -f
echo.
echo View specific service logs:
echo   docker-compose logs -f backend
echo   docker-compose logs -f frontend
echo   docker-compose logs -f postgres
echo.
echo Stop all services:
echo   docker-compose down
echo.
echo Stop and remove data:
echo   docker-compose down -v
echo.
echo Rebuild services:
echo   docker-compose build --no-cache
echo.
echo Check service status:
echo   docker-compose ps
echo.
echo ==========================================
echo.
echo Press any key to view logs...
pause

REM Show logs
docker-compose logs -f

pause
