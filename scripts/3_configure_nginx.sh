#!/usr/bin/env bash

set -e

SERVER_IP=$(curl -s http://checkip.amazonaws.com)
NGINX_CONF="/etc/nginx/sites-available/fastapi"

echo "Creating Nginx config..."
sudo bash -c "cat > $NGINX_CONF" <<EOF
server {
    listen 80;
    server_name $SERVER_IP;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF

echo "Enabling Nginx site..."
sudo ln -sf $NGINX_CONF /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx

echo "Enabling HTTPS with Let's Encrypt"
sudo certbot --nginx