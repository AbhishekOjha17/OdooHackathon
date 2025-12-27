# Quick Fix for MySQL Connection Error

## Problem
MySQL is not running. The error `ECONNREFUSED` means the MySQL server is not accessible on port 3306.

## Solution Options

### Option 1: Install and Start MySQL (Recommended)

**A. Install MySQL:**
1. Download MySQL Installer: https://dev.mysql.com/downloads/installer/
2. Choose "MySQL Server" and install
3. During installation, set a root password (remember it!)
4. Complete installation

**B. Start MySQL Service:**
```powershell
# Find MySQL service
Get-Service | Where-Object {$_.Name -like "*mysql*"}

# Start MySQL (adjust name if different)
Start-Service MySQL80
# or
Start-Service MySQL
```

**C. Verify it's running:**
```powershell
netstat -an | findstr :3306
```
You should see: `TCP    0.0.0.0:3306`

**D. Update .env file:**
Edit `backend/.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=gearguard
PORT=5500
```

**E. Create database:**
```powershell
mysql -u root -p < backend/schema.sql
```

---

### Option 2: Use XAMPP (Easier for Beginners)

1. Download XAMPP: https://www.apachefriends.org/
2. Install XAMPP
3. Open XAMPP Control Panel
4. Click "Start" next to MySQL
5. Update `.env` file:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=gearguard
   PORT=5500
   ```
6. Create database using phpMyAdmin (http://localhost/phpMyAdmin) or command line

---

### Option 3: Use SQLite (Temporary - Not Recommended for Production)

If you just want to test the app quickly without MySQL, I can modify the code to use SQLite temporarily. But MySQL is required for the final setup.

---

## After MySQL is Running

1. Restart your backend server
2. You should see: `✅ Database connected successfully`
3. Test: `http://localhost:5500/test/db`
4. Try signup/login again

## Still Having Issues?

Run this to test connection:
```powershell
cd backend
node check-db.js
```

This will show you exactly what's wrong.

