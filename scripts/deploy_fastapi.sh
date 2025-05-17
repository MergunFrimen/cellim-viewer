#!/usr/bin/env bash

set -e

APP_DIR="/home/ubuntu/fastapi-app"
APP_MODULE="app:app"  # Adjust if your app is named differently

echo "Cloning your FastAPI repo..."
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git $APP_DIR

echo "Setting up virtual environment..."
cd $APP_DIR
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn uvicorn[standard]

echo "Creating systemd service..."
SERVICE_FILE="/etc/systemd/system/fastapi.service"

sudo bash -c "cat > $SERVICE_FILE" <<EOF
[Unit]
Description=FastAPI app
After=network.target

[Service]
User=ubuntu
WorkingDirectory=$APP_DIR
ExecStart=$APP_DIR/venv/bin/gunicorn $APP_MODULE -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
Restart=always

[Install]
WantedBy=multi-user.target
EOF

echo "Enabling and starting FastAPI service..."
sudo systemctl daemon-reload
sudo systemctl enable fastapi
sudo systemctl start fastapi
