# Deployment Guide - Final-Jobzz-2025

## Overview
This guide covers the complete deployment process for the Final-Jobzz-2025 job portal application, including both backend API and frontend React application.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [Backend Deployment](#backend-deployment)
5. [Frontend Deployment](#frontend-deployment)
6. [Production Configuration](#production-configuration)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements
- **Node.js**: v14.0.0 or higher
- **npm**: v6.0.0 or higher
- **MongoDB**: v4.4 or higher
- **Git**: Latest version

### Hosting Requirements
- **Backend**: VPS/Cloud server with Node.js support
- **Frontend**: Static hosting service or CDN
- **Database**: MongoDB Atlas or self-hosted MongoDB
- **Domain**: Custom domain (optional)
- **SSL**: SSL certificate for HTTPS

## Environment Setup

### Production Environment Variables

#### Backend (.env)
```env
# Server Configuration
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jobportal?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_minimum_32_characters
JWT_EXPIRE=7d

# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

# Admin Configuration
ADMIN_EMAIL=admin@yourjobportal.com
ADMIN_PASSWORD=secure_admin_password

# CORS Configuration
FRONTEND_URL=https://yourjobportal.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=10000
```

#### Frontend Environment Variables
Create `.env.production` file:
```env
REACT_APP_API_URL=https://api.yourjobportal.com/api
REACT_APP_ENVIRONMENT=production
REACT_APP_APP_NAME=JobPortal
```

## Database Setup

### MongoDB Atlas (Recommended)

1. **Create MongoDB Atlas Account**
   - Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create free account
   - Create new cluster

2. **Configure Database**
   ```bash
   # Create database user
   Username: jobportal_user
   Password: [generate secure password]
   
   # Whitelist IP addresses
   0.0.0.0/0 (for production, use specific IPs)
   ```

3. **Get Connection String**
   ```
   mongodb+srv://jobportal_user:password@cluster.mongodb.net/jobportal?retryWrites=true&w=majority
   ```

### Self-Hosted MongoDB

1. **Install MongoDB**
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install mongodb
   
   # CentOS/RHEL
   sudo yum install mongodb-server
   ```

2. **Configure MongoDB**
   ```bash
   # Edit configuration
   sudo nano /etc/mongod.conf
   
   # Enable authentication
   security:
     authorization: enabled
   ```

3. **Create Database User**
   ```javascript
   use jobportal
   db.createUser({
     user: "jobportal_user",
     pwd: "secure_password",
     roles: ["readWrite"]
   })
   ```

## Backend Deployment

### Option 1: Heroku Deployment

1. **Prepare Application**
   ```bash
   cd tale-backend
   
   # Create Procfile
   echo "web: node server.js" > Procfile
   
   # Update package.json
   {
     "scripts": {
       "start": "node server.js",
       "heroku-postbuild": "npm install"
     },
     "engines": {
       "node": "18.x",
       "npm": "9.x"
     }
   }
   ```

2. **Deploy to Heroku**
   ```bash
   # Install Heroku CLI
   npm install -g heroku
   
   # Login to Heroku
   heroku login
   
   # Create Heroku app
   heroku create your-jobportal-api
   
   # Set environment variables
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI="your_mongodb_connection_string"
   heroku config:set JWT_SECRET="your_jwt_secret"
   heroku config:set EMAIL_USER="your_email@gmail.com"
   heroku config:set EMAIL_PASS="your_app_password"
   
   # Deploy
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

### Option 2: DigitalOcean Droplet

1. **Create Droplet**
   ```bash
   # Create Ubuntu 20.04 droplet
   # Connect via SSH
   ssh root@your_server_ip
   ```

2. **Install Dependencies**
   ```bash
   # Update system
   apt update && apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   apt-get install -y nodejs
   
   # Install PM2
   npm install -g pm2
   
   # Install Nginx
   apt install nginx -y
   ```

3. **Deploy Application**
   ```bash
   # Clone repository
   git clone https://github.com/yourusername/Final-Jobzz-2025.git
   cd Final-Jobzz-2025/tale-backend
   
   # Install dependencies
   npm install --production
   
   # Create environment file
   nano .env
   # Add production environment variables
   
   # Start with PM2
   pm2 start server.js --name "jobportal-api"
   pm2 startup
   pm2 save
   ```

4. **Configure Nginx**
   ```bash
   # Create Nginx configuration
   nano /etc/nginx/sites-available/jobportal-api
   ```
   
   ```nginx
   server {
       listen 80;
       server_name api.yourjobportal.com;
   
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   ```bash
   # Enable site
   ln -s /etc/nginx/sites-available/jobportal-api /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```

### Option 3: AWS EC2

1. **Launch EC2 Instance**
   - Choose Amazon Linux 2 AMI
   - Select t2.micro (free tier)
   - Configure security groups (ports 22, 80, 443, 5000)

2. **Setup Instance**
   ```bash
   # Connect to instance
   ssh -i your-key.pem ec2-user@your-instance-ip
   
   # Install Node.js
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   source ~/.bashrc
   nvm install 18
   nvm use 18
   
   # Install PM2
   npm install -g pm2
   ```

3. **Deploy Application**
   ```bash
   # Clone and setup
   git clone https://github.com/yourusername/Final-Jobzz-2025.git
   cd Final-Jobzz-2025/tale-backend
   npm install --production
   
   # Configure environment
   cp .env.example .env
   nano .env
   
   # Start application
   pm2 start server.js --name jobportal-api
   pm2 startup
   pm2 save
   ```

## Frontend Deployment

### Option 1: Netlify (Recommended)

1. **Build Application**
   ```bash
   cd Final-Jobzz-2025
   
   # Install dependencies
   npm install
   
   # Create production environment file
   echo "REACT_APP_API_URL=https://api.yourjobportal.com/api" > .env.production
   
   # Build for production
   npm run build
   ```

2. **Deploy to Netlify**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Login to Netlify
   netlify login
   
   # Deploy
   netlify deploy --prod --dir=build
   ```

3. **Configure Redirects**
   Create `public/_redirects` file:
   ```
   /*    /index.html   200
   ```

### Option 2: Vercel

1. **Deploy with Vercel CLI**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Login and deploy
   vercel login
   vercel --prod
   ```

2. **Configure Environment Variables**
   ```bash
   vercel env add REACT_APP_API_URL production
   # Enter: https://api.yourjobportal.com/api
   ```

### Option 3: AWS S3 + CloudFront

1. **Build and Upload**
   ```bash
   # Build application
   npm run build
   
   # Install AWS CLI
   pip install awscli
   
   # Configure AWS credentials
   aws configure
   
   # Create S3 bucket
   aws s3 mb s3://your-jobportal-frontend
   
   # Upload build files
   aws s3 sync build/ s3://your-jobportal-frontend --delete
   
   # Configure bucket for static hosting
   aws s3 website s3://your-jobportal-frontend --index-document index.html --error-document index.html
   ```

2. **Setup CloudFront**
   - Create CloudFront distribution
   - Point to S3 bucket
   - Configure custom error pages (404 -> /index.html)

## Production Configuration

### SSL Certificate Setup

#### Using Let's Encrypt (Free)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d api.yourjobportal.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### Using Cloudflare (Recommended)
1. Add domain to Cloudflare
2. Update nameservers
3. Enable SSL/TLS encryption
4. Configure page rules for caching

### Database Optimization

#### MongoDB Indexes
```javascript
// Connect to MongoDB and create indexes
use jobportal

// Job search indexes
db.jobs.createIndex({ "title": "text", "description": "text" })
db.jobs.createIndex({ "category": 1, "location": 1, "status": 1 })
db.jobs.createIndex({ "employerId": 1, "status": 1 })
db.jobs.createIndex({ "createdAt": -1 })

// User indexes
db.candidates.createIndex({ "email": 1 }, { unique: true })
db.employers.createIndex({ "email": 1 }, { unique: true })

// Application indexes
db.applications.createIndex({ "candidateId": 1, "status": 1 })
db.applications.createIndex({ "jobId": 1, "status": 1 })
db.applications.createIndex({ "employerId": 1, "status": 1 })
```

### Performance Optimization

#### Backend Optimizations
```javascript
// server.js additions for production
const compression = require('compression');
const morgan = require('morgan');

// Enable compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
}

// Static file caching
app.use(express.static('public', {
  maxAge: '1y',
  etag: false
}));
```

#### Frontend Optimizations
```json
// package.json build optimization
{
  "scripts": {
    "build": "GENERATE_SOURCEMAP=false react-scripts build",
    "build:analyze": "npm run build && npx webpack-bundle-analyzer build/static/js/*.js"
  }
}
```

### Security Configuration

#### Backend Security Headers
```javascript
// Enhanced helmet configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

#### Environment Security
```bash
# Secure file permissions
chmod 600 .env
chown root:root .env

# Firewall configuration
ufw allow ssh
ufw allow 80
ufw allow 443
ufw enable
```

## Monitoring & Maintenance

### Application Monitoring

#### PM2 Monitoring
```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs jobportal-api

# Restart application
pm2 restart jobportal-api

# Update application
git pull origin main
npm install --production
pm2 restart jobportal-api
```

#### Health Checks
```bash
# Create health check script
nano /home/ubuntu/health-check.sh
```

```bash
#!/bin/bash
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/health)
if [ $response != "200" ]; then
    pm2 restart jobportal-api
    echo "$(date): Application restarted due to health check failure" >> /var/log/jobportal-health.log
fi
```

```bash
# Make executable and add to cron
chmod +x /home/ubuntu/health-check.sh
crontab -e
# Add: */5 * * * * /home/ubuntu/health-check.sh
```

### Database Backup

#### Automated MongoDB Backup
```bash
# Create backup script
nano /home/ubuntu/backup-db.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/ubuntu/backups"
mkdir -p $BACKUP_DIR

# Create backup
mongodump --uri="$MONGODB_URI" --out="$BACKUP_DIR/backup_$DATE"

# Compress backup
tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" -C "$BACKUP_DIR" "backup_$DATE"
rm -rf "$BACKUP_DIR/backup_$DATE"

# Keep only last 7 days of backups
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +7 -delete

echo "$(date): Database backup completed - backup_$DATE.tar.gz" >> /var/log/jobportal-backup.log
```

```bash
# Schedule daily backups
chmod +x /home/ubuntu/backup-db.sh
crontab -e
# Add: 0 2 * * * /home/ubuntu/backup-db.sh
```

### Log Management

#### Log Rotation
```bash
# Configure logrotate
sudo nano /etc/logrotate.d/jobportal
```

```
/home/ubuntu/.pm2/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    notifempty
    create 0640 ubuntu ubuntu
    postrotate
        pm2 reloadLogs
    endscript
}
```

### Performance Monitoring

#### Server Monitoring Script
```bash
# Create monitoring script
nano /home/ubuntu/monitor.sh
```

```bash
#!/bin/bash
LOG_FILE="/var/log/jobportal-monitor.log"

# CPU and Memory usage
CPU=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}')
MEMORY=$(free | grep Mem | awk '{printf("%.2f", $3/$2 * 100.0)}')

# Disk usage
DISK=$(df -h / | awk 'NR==2{printf "%s", $5}')

# Log metrics
echo "$(date): CPU: ${CPU}%, Memory: ${MEMORY}%, Disk: ${DISK}" >> $LOG_FILE

# Alert if usage is high
if (( $(echo "$CPU > 80" | bc -l) )); then
    echo "$(date): HIGH CPU USAGE: ${CPU}%" >> $LOG_FILE
fi

if (( $(echo "$MEMORY > 80" | bc -l) )); then
    echo "$(date): HIGH MEMORY USAGE: ${MEMORY}%" >> $LOG_FILE
fi
```

## Troubleshooting

### Common Issues

#### Backend Issues

1. **Application Won't Start**
   ```bash
   # Check logs
   pm2 logs jobportal-api
   
   # Check environment variables
   pm2 env 0
   
   # Restart application
   pm2 restart jobportal-api
   ```

2. **Database Connection Issues**
   ```bash
   # Test MongoDB connection
   node -e "
   const mongoose = require('mongoose');
   mongoose.connect(process.env.MONGODB_URI)
     .then(() => console.log('Connected'))
     .catch(err => console.error('Error:', err));
   "
   ```

3. **High Memory Usage**
   ```bash
   # Check memory usage
   pm2 monit
   
   # Restart if needed
   pm2 restart jobportal-api
   
   # Check for memory leaks
   node --inspect server.js
   ```

#### Frontend Issues

1. **Build Failures**
   ```bash
   # Clear cache
   npm run build -- --reset-cache
   
   # Check for dependency issues
   npm audit
   npm audit fix
   ```

2. **API Connection Issues**
   ```bash
   # Check environment variables
   echo $REACT_APP_API_URL
   
   # Test API endpoint
   curl https://api.yourjobportal.com/health
   ```

### Emergency Procedures

#### Quick Rollback
```bash
# Backend rollback
cd Final-Jobzz-2025/tale-backend
git log --oneline -5
git checkout <previous_commit_hash>
pm2 restart jobportal-api

# Frontend rollback (Netlify)
netlify sites:list
netlify rollback --site-id <site_id>
```

#### Database Recovery
```bash
# Restore from backup
tar -xzf backup_YYYYMMDD_HHMMSS.tar.gz
mongorestore --uri="$MONGODB_URI" --drop backup_YYYYMMDD_HHMMSS/
```

## Maintenance Schedule

### Daily Tasks
- Monitor application logs
- Check system resources
- Verify backup completion

### Weekly Tasks
- Review performance metrics
- Update dependencies (if needed)
- Check SSL certificate status

### Monthly Tasks
- Security updates
- Database optimization
- Performance analysis
- Backup testing

## Support and Documentation

### Useful Commands
```bash
# Backend management
pm2 status
pm2 restart all
pm2 logs --lines 100

# System monitoring
htop
df -h
free -h
netstat -tulpn

# Database operations
mongo --eval "db.stats()"
mongodump --uri="$MONGODB_URI"
```

### Contact Information
- **Technical Support**: tech@yourjobportal.com
- **Emergency Contact**: +1-XXX-XXX-XXXX
- **Documentation**: https://docs.yourjobportal.com

This deployment guide provides comprehensive instructions for deploying the Final-Jobzz-2025 application in production environments with proper security, monitoring, and maintenance procedures.