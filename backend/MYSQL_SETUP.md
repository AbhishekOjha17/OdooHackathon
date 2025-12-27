# MySQL Setup Guide

## The Error: ECONNREFUSED

This means MySQL is not running or not accessible.

## Step 1: Check if MySQL is Installed

Open PowerShell and run:
```powershell
mysql --version
```

If you get "command not found", MySQL is not installed.

## Step 2: Install MySQL (if not installed)

### Option A: Download MySQL Installer
1. Go to: https://dev.mysql.com/downloads/installer/
2. Download "MySQL Installer for Windows"
3. Run the installer
4. Choose "Developer Default" or "Server only"
5. Set root password (remember this!)
6. Complete installation

### Option B: Use XAMPP (Easier)
1. Download XAMPP: https://www.apachefriends.org/
2. Install XAMPP
3. Open XAMPP Control Panel
4. Start MySQL service

## Step 3: Start MySQL Service

### If using MySQL Installer:
```powershell
# Check service name
Get-Service | Where-Object {$_.Name -like "*mysql*"}

# Start MySQL (adjust service name)
Start-Service MySQL80
# or
Start-Service MySQL
```

### If using XAMPP:
- Open XAMPP Control Panel
- Click "Start" next to MySQL

## Step 4: Verify MySQL is Running

```powershell
# Check if port 3306 is listening
netstat -an | findstr :3306
```

You should see something like: `TCP    0.0.0.0:3306`

## Step 5: Update .env File

Edit `backend/.env` and set your MySQL password:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=gearguard
PORT=5500
```

## Step 6: Test Connection

```powershell
cd backend
node check-db.js
```

## Step 7: Create Database

Once connection works, create the database:
```powershell
mysql -u root -p < schema.sql
```

Or manually:
1. Open MySQL Workbench or command line
2. Run: `CREATE DATABASE IF NOT EXISTS gearguard;`
3. Then run the rest of `schema.sql`

## Quick Test Without MySQL

If you want to test the app without MySQL first, you can use a mock database or SQLite, but for production you need MySQL.

