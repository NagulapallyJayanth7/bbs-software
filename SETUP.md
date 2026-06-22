# Bar Bending Schedule (BBS) - Setup Guide

## Prerequisites

Before running this application, ensure you have:

- **Node.js** v14 or higher ([Download](https://nodejs.org/))
- **PostgreSQL** v12 or higher ([Download](https://www.postgresql.org/download/))
- **npm** (comes with Node.js)

## Quick Start

### Step 1: PostgreSQL Setup

1. **Create a new database**:
   ```sql
   CREATE DATABASE bbs_database;
   ```

2. **Verify the connection**:
   - Host: `localhost`
   - Port: `5432`
   - Database: `bbs_database`
   - Username: `postgres`
   - Password: (your PostgreSQL password)

### Step 2: Update Environment Variables

1. Open `backend/.env`
2. Update the database credentials to match your PostgreSQL setup:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=bbs_database
   DB_USER=postgres
   DB_PASSWORD=your_password
   ```

### Step 3: Start the Application

**Option 1: Run both frontend and backend together**
```bash
npm run dev
```

**Option 2: Run separately**

Terminal 1 - Backend:
```bash
cd backend
npm start
```

Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

### Step 4: Access the Application

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000/api`

## File Structure

```
BBS/
├── backend/          # Express.js API server
│   ├── controllers/  # Business logic
│   ├── routes/       # API endpoints
│   ├── server.js     # Main server file
│   ├── .env          # Environment variables
│   └── package.json
├── frontend/         # React application
│   ├── src/
│   │   ├── components/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── package.json      # Root package file
```

## Key Features

✅ Create and manage construction projects  
✅ Add detailed bar bending schedules  
✅ Store data in PostgreSQL database  
✅ Responsive web interface  
✅ RESTful API backend  

## Troubleshooting

### "Cannot connect to database"
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database `bbs_database` exists

### "Port 3000 or 5000 already in use"
- Kill the process using that port or change the port in `.env`

### "npm ERR! missing script"
- Run `npm run install-all` to install all dependencies

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Run frontend and backend concurrently |
| `npm run server` | Run backend only |
| `npm run client` | Run frontend only |
| `npm run build` | Build frontend for production |
| `npm run install-all` | Install all dependencies |

## Next Steps

1. Create your first project
2. Add bar bending schedules
3. Manage construction data efficiently

Happy coding! 🎉
