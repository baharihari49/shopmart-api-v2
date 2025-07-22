# Deployment Guide - ShopMart API

## Prerequisites

- Ubuntu VPS (20.04 atau lebih baru)
- Node.js 18+ terinstall
- PostgreSQL terinstall
- PM2 terinstall globally
- Nginx terinstall
- Domain yang sudah diarahkan ke IP VPS

## Langkah-langkah Deployment

### 1. Persiapan Server

```bash
# Update sistem
sudo apt update && sudo apt upgrade -y

# Install Node.js (jika belum)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Git
sudo apt install -y git
```

### 2. Setup Database

```bash
# Masuk ke PostgreSQL
sudo -u postgres psql

# Buat database dan user
CREATE DATABASE shopmart_db;
CREATE USER shopmart_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE shopmart_db TO shopmart_user;
\q
```

### 3. Clone dan Setup Aplikasi

```bash
# Buat direktori aplikasi
sudo mkdir -p /var/www/shopmart-api
sudo chown $USER:$USER /var/www/shopmart-api

# Clone repository
cd /var/www/shopmart-api
git clone <your-repo-url> .

# Install dependencies
npm install

# Copy dan edit environment production
cp .env.production .env
nano .env  # Edit sesuai konfigurasi server

# Build aplikasi
npm run build

# Jalankan migration dan seed (jika perlu)
npm run migrate:prod
npm run seed:prod
```

### 4. Setup PM2

```bash
# Start aplikasi dengan PM2
pm2 start ecosystem.config.js --env production

# Save konfigurasi PM2
pm2 save

# Setup PM2 startup
pm2 startup systemd
# Ikuti instruksi yang muncul

# Monitoring
pm2 monit
```

### 5. Setup Nginx

```bash
# Copy konfigurasi Nginx
sudo cp nginx.conf /etc/nginx/sites-available/shopmart-api

# Edit konfigurasi (ganti domain)
sudo nano /etc/nginx/sites-available/shopmart-api

# Enable site
sudo ln -s /etc/nginx/sites-available/shopmart-api /etc/nginx/sites-enabled/

# Test konfigurasi
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 6. Setup SSL dengan Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Generate SSL certificate
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

### 7. Setup Firewall

```bash
# Allow SSH, HTTP, dan HTTPS
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 8. Setup Logs

```bash
# Buat direktori logs
mkdir -p /var/www/shopmart-api/logs

# Setup log rotation
sudo nano /etc/logrotate.d/shopmart-api
```

Isi dengan:
```
/var/www/shopmart-api/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
```

## Update Deployment

```bash
cd /var/www/shopmart-api
git pull origin main
npm install
npm run build
pm2 reload shopmart-api
```

## Monitoring

```bash
# Check status
pm2 status

# View logs
pm2 logs shopmart-api

# Monitor resources
pm2 monit

# Nginx logs
sudo tail -f /var/log/nginx/shopmart-api-access.log
sudo tail -f /var/log/nginx/shopmart-api-error.log
```

## Troubleshooting

### Aplikasi tidak berjalan
```bash
pm2 logs shopmart-api --lines 100
pm2 describe shopmart-api
```

### Database connection error
- Periksa kredensial di .env
- Periksa status PostgreSQL: `sudo systemctl status postgresql`

### Nginx error
- Test konfigurasi: `sudo nginx -t`
- Check logs: `sudo tail -f /var/log/nginx/error.log`

### Port sudah digunakan
```bash
sudo lsof -i :5000
# Kill process jika perlu
```

## Backup

### Database backup script
```bash
#!/bin/bash
# backup-db.sh
BACKUP_DIR="/var/backups/shopmart"
mkdir -p $BACKUP_DIR
pg_dump -U shopmart_user shopmart_db > $BACKUP_DIR/shopmart_$(date +%Y%m%d_%H%M%S).sql
# Hapus backup lama (> 7 hari)
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
```

### Setup cron job
```bash
crontab -e
# Tambahkan:
0 2 * * * /home/user/backup-db.sh
```