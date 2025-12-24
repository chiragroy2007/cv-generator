# CV Generator - VPS Deployment Guide

This guide describes how to deploy the CV Generator (TeamNeuron) to a Linux VPS (e.g., Ubuntu 22.04).

## 1. Prerequisites

You need a VPS with **at least 2GB RAM** (4GB recommended) because `rendercv` and LaTeX compilation can be resource-intensive.

### Install System Dependencies
Update your system and install Python, Node.js, and the **critical** LaTeX distribution.

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3 python3-pip python3-venv nodejs npm nginx git

# CRITICAL: Install full TeX Live distribution (this is large, ~3-4GB)
# If storage is tight, you can try texlive-base texlive-latex-extra texlive-fonts-recommended
sudo apt install -y texlive-full 
```

---

## 2. Project Setup

Clone your repository to the server (e.g., to `/var/www/cv-gen`).

```bash
mkdir -p /var/www/cv-gen
# Upload your code here via git clone or scp
cd /var/www/cv-gen
```

---

## 3. Backend Deployment

### Setup Python Environment
```bash
cd backend
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn[standard] gunicorn rendercv pydantic
# verify installation
pip list
```

### Create Systemd Service
Create a service to keep the backend running.

`sudo nano /etc/systemd/system/cv-backend.service`

```ini
[Unit]
Description=CV Generator Backend
After=network.target

[Service]
User=root
WorkingDirectory=/var/www/cv-gen
Environment="PATH=/var/www/cv-gen/backend/venv/bin:/usr/bin"
# Run with Gunicorn managing Uvicorn workers
ExecStart=/var/www/cv-gen/backend/venv/bin/gunicorn -w 4 -k uvicorn.workers.UvicornWorker backend.main:app --bind 127.0.0.1:8000

Restart=always

[Install]
WantedBy=multi-user.target
```

**Start the Backend:**
```bash
sudo systemctl daemon-reload
sudo systemctl start cv-backend
sudo systemctl enable cv-backend
```

---

## 4. Frontend Deployment

### Build the React App
The frontend needs to be compiled into static HTML/CSS/JS files.

```bash
cd /var/www/cv-gen/frontend
npm install
npm run build
```

The output will be in `/var/www/cv-gen/frontend/dist`.

---

## 5. Nginx Configuration (Reverse Proxy)

Configure Nginx to serve the frontend and proxy API requests to the Python backend.

`sudo nano /etc/nginx/sites-available/cv-gen`

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com; # Or your IP address

    root /var/www/cv-gen/frontend/dist;
    index index.html;

    # 1. Serve Frontend
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 2. Proxy API requests to Backend
    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 3. Proxy Generated Files (PDFs/HTMLs)
    location /generated {
        proxy_pass http://127.0.0.1:8000;
    }
}
```

**Activate Config:**
```bash
sudo ln -s /etc/nginx/sites-available/cv-gen /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 6. Maintenance (Disk Space)

The backend saves generated CVs in `backend/generated_cvs` and does not delete them. On a live server, this will fill up.

**Setup a Cron Job to auto-delete files older than 60 minutes:**

```bash
crontab -e
```

Add this line:
```bash
# Verify the path matches your actual generated_cvs folder location!
*/30 * * * * find /var/www/cv-gen/generated_cvs -type f -mmin +60 -delete
```
