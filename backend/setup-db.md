# Database Setup Instructions

## Quick Setup

1. **Make sure MySQL is running**

2. **Create the database and tables:**
   
   Option A - Using MySQL command line:
   ```bash
   mysql -u root -p < schema.sql
   ```
   
   Option B - Using MySQL Workbench or phpMyAdmin:
   - Open the `schema.sql` file
   - Copy and paste the entire content
   - Execute it

3. **Verify the database was created:**
   ```bash
   mysql -u root -p
   USE gearguard;
   SHOW TABLES;
   ```
   You should see: companies, users, equipment_categories, work_centers, equipment, teams, team_members, maintenance_status, maintenance_requests

4. **Check your `.env` file in the backend folder:**
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=gearguard
   PORT=5500
   ```

5. **Test the database connection:**
   - Start your backend server: `npm start`
   - Visit: `http://localhost:5500/test/db`
   - You should see: `{"success":true,"message":"Database connection successful"}`

6. **If you get errors:**
   - Check the backend terminal for detailed error messages
   - Make sure MySQL is running
   - Verify your database credentials in `.env`
   - Make sure the `gearguard` database exists

