#!/usr/bin/env bash

set -e

echo "Updating system..."
sudo apt update && sudo apt upgrade -y

echo "Installing Python, pip, venv..."
sudo apt install -y python3 python3-pip python3-venv

echo "Installing Git (optional)..."
sudo apt install -y git

echo "Installing Nginx..."
sudo apt install -y nginx

echo "Installing Certbot for HTTPS (optional)..."
sudo apt install -y certbot python3-certbot-nginx
