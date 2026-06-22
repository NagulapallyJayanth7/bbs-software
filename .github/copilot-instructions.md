<!-- Use this file to provide workspace-specific custom instructions to Copilot -->

## Bar Bending Schedule (BBS) Application

This is a full-stack web application for managing bar bending schedules in construction projects.

### Project Overview
- **Frontend**: React 18 with HTML/CSS/JavaScript
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL
- **Purpose**: Create, manage, and track bar bending schedules for construction projects

### Key Features
- Project management (create, read, update, delete)
- Bar bending schedule management
- Data persistence with PostgreSQL
- Responsive web interface
- RESTful API backend

### Getting Started

1. **Install all dependencies**:
   ```bash
   npm run install-all
   ```

2. **Configure PostgreSQL**:
   - Create `.env` file in `backend/` from `.env.example`
   - Update database credentials

3. **Run the application**:
   ```bash
   npm run dev
   ```

4. **Access the app**: Open http://localhost:3000

### Project Structure
- `/backend` - Express.js API server
- `/frontend` - React application
- `/backend/routes` - API routes
- `/backend/controllers` - Business logic
- `/frontend/src/components` - React components

### Development Guidelines
- Backend runs on port 5000
- Frontend runs on port 3000
- Use environment variables for configuration
- Follow REST conventions for API
- Keep components modular and reusable

### Common Tasks
- Add schedule: Create project first, then add schedules
- Delete project: Cascades to delete associated schedules
- View data: All data persists in PostgreSQL
