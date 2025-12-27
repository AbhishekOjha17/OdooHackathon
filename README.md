# GearGuard CMMS

Maintenance Management System with Next.js frontend and Node.js/Express backend.

## Setup

### Backend

1. Navigate to `backend` folder
2. Install dependencies: `npm install`
3. Create `.env` file with your MySQL credentials:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=gearguard
   PORT=5500
   ```
4. Run the SQL schema: `mysql -u root -p < schema.sql`
5. Start server: `npm start`

### Frontend

1. Install dependencies: `npm install`
2. Add placeholder images to `public` folder:
   - `public/image1.png` - Abstract light background
   - `public/image2.png` - Abstract metallic shapes
3. Start dev server: `npm run dev`
4. Open http://localhost:3000

## API Endpoints

- `POST /auth/login` - Login
- `POST /auth/signup` - Signup
- `GET /equipment` - List equipment
- `GET /equipment/:id` - Equipment details
- `GET /maintenance` - List maintenance requests
- `POST /maintenance` - Create maintenance request
- `GET /teams` - List teams

