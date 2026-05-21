# 🐳 INSTALLING DOCKER COMPOSE ON LINUX

I see you're trying to install Docker Compose manually on Linux. Here's the complete guide:

---

## ✅ INSTALL DOCKER COMPOSE ON LINUX

### Step 1: Download Docker Compose

Copy and paste this command:

```bash
curl -SL https://github.com/docker/compose/releases/download/v2.24.6/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
```

**Note:** I updated the version to `v2.24.6` (latest stable). Your `v5.1.2` might not exist.

### Step 2: Make It Executable

```bash
chmod +x /usr/local/bin/docker-compose
```

### Step 3: Verify Installation

```bash
docker-compose --version
```

Should show:
```
Docker Compose version 2.24.6
```

---

## ✅ ALTERNATIVE: USE DOCKER COMPOSE V2 (Recommended)

Docker Compose is now a plugin. Use this instead:

```bash
docker compose --version
```

(Note: `docker compose` not `docker-compose`)

---

## ✅ IF YOU GET PERMISSION ERROR

Add `sudo`:

```bash
sudo curl -SL https://github.com/docker/compose/releases/download/v2.24.6/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

---

## ✅ ALTERNATIVE: INSTALL VIA PIP (Easier)

```bash
sudo pip install docker-compose
```

Or:

```bash
pip3 install docker-compose
```

---

## ✅ VERIFY EVERYTHING IS INSTALLED

```bash
docker --version
docker-compose --version
docker compose version
```

All three should work.

---

## 🚀 NOW YOU CAN RUN YOUR TENAR PROJECT

Navigate to your tenar folder:

```bash
cd tenar
```

Create .env file:

```bash
cp .env.example .env
```

Start the project:

```bash
docker-compose up -d
```

Wait 30-60 seconds, then open:

```
http://localhost
```

---

## ✅ IF DOCKER IS NOT INSTALLED

Install Docker first:

```bash
sudo apt update
sudo apt install docker.io
sudo usermod -aG docker $USER
newgrp docker
```

Then install Docker Compose:

```bash
sudo pip install docker-compose
```

---

## 🆘 TROUBLESHOOTING

### Error: "curl: command not found"

Install curl:
```bash
sudo apt install curl
```

### Error: "pip: command not found"

Install pip:
```bash
sudo apt install python3-pip
```

### Error: "Permission denied"

Use sudo:
```bash
sudo curl -SL https://github.com/docker/compose/releases/download/v2.24.6/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Docker daemon not running

Start Docker:
```bash
sudo systemctl start docker
```

---

## ✅ QUICK SETUP FOR LINUX (Complete)

Copy-paste this entire block:

```bash
# Install prerequisites
sudo apt update
sudo apt install -y curl python3-pip

# Install Docker
sudo apt install -y docker.io

# Allow non-root user to use Docker
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo pip install docker-compose

# Verify installation
docker --version
docker-compose --version

# Navigate to project
cd tenar

# Create .env file
cp .env.example .env

# Start project
docker-compose up -d

# Wait 30-60 seconds
sleep 60

# Check status
docker-compose ps
```

Then open: **http://localhost**

---

## 📋 WHAT YOU'LL SEE

```
Creating network "tenar_tenar_network" with driver "bridge"
Creating tenar_postgres ... done
Creating tenar_backend ... done
Creating tenar_frontend ... done
Creating tenar_pgadmin ... done
Creating tenar_nginx ... done
```

All services created and running!

---

## 🎯 DONE!

Your TENAR project should now be running at: **http://localhost** 🎉

---

## 💡 COMMON LINUX COMMANDS FOR TENAR

```bash
# Check if Docker is running
sudo systemctl status docker

# Start Docker
sudo systemctl start docker

# Stop Docker
sudo systemctl stop docker

# View all Docker containers
docker ps -a

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Restart services
docker-compose restart

# Clean everything
docker-compose down -v
```

---

## 🆘 STILL HAVING ISSUES?

Tell me:
1. **Your Linux distribution** (Ubuntu, Debian, CentOS, etc.)
2. **Exact error message** (copy and paste)
3. **What command caused the error?**

I'll give you the exact fix! 🚀
