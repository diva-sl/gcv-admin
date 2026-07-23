#!/bin/bash

# Configuration Variables
WEB_ROOT="/var/www/gcv-admin"
NGINX_CONF="/etc/nginx/sites-available/gcv-admin"
NGINX_LINK="/etc/nginx/sites-enabled/gcv-admin"
DOMAIN="admin.gcvdanta.com" # Replace with your actual domain name (e.g., admin.gcvdanta.in)

echo "🚀 Starting GCV Admin Panel Deployment..."

# 1. Update system packages
echo "Updating packages..."
sudo apt update -y

# 2. Check and install Node.js if not present
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
fi

# 3. Check and install Nginx if not present
if ! command -v nginx &> /dev/null; then
    echo "Installing Nginx..."
    sudo apt install -y nginx
fi

# 4. Prepare Web Root Directory
echo "Preparing deployment directories..."
sudo mkdir -p $WEB_ROOT
sudo chown -R $USER:$USER $WEB_ROOT

# 5. Build Admin Panel Project
echo "Installing project dependencies & compiling..."
npm install
npm run build

# 6. Copy build assets to Web Root
echo "Copying compiled assets to web root..."
cp -r dist/* $WEB_ROOT/

# 7. Configure Nginx Server Block
echo "Configuring Nginx virtual host..."
sudo bash -c "cat > $NGINX_CONF" <<EOF
server {
    listen 80;
    server_name $DOMAIN;

    root $WEB_ROOT;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # React SPA Fallback
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # API Proxy to Go Backend (Port 5000)
    location /api/ {
        proxy_pass http://127.0.0.1:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }

    error_log /var/log/nginx/gcv_admin_error.log;
    access_log /var/log/nginx/gcv_admin_access.log;
}
EOF

# 8. Enable Nginx configuration site
if [ ! -f "$NGINX_LINK" ]; then
    echo "Enabling Nginx server block..."
    sudo ln -s $NGINX_CONF $NGINX_LINK
fi

# 9. Test and reload Nginx
echo "Testing Nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "Nginx settings verified. Reloading..."
    sudo systemctl reload nginx
    echo "✅ GCV Admin Panel deployed successfully to http://$DOMAIN"
else
    echo "❌ Nginx configuration check failed. Verify logs."
    exit 1
fi
