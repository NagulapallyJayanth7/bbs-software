# Bar Bending Schedule (BBS) Software

A comprehensive web application for managing bar bending schedules in construction projects.

## Features

- **Project Management**: Create, view, and manage construction projects
- **Schedule Management**: Add detailed bar bending schedules for each project
- **Bar Details Tracking**: Record bar diameter, type, quantity, length, and units
- **Data Persistence**: All data stored in PostgreSQL database
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18, HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Package Manager**: npm

## Project Structure

```
BBS/
├── backend/
│   ├── controllers/
│   │   ├── projectController.js
│   │   └── scheduleController.js
│   ├── routes/
│   │   ├── projects.js
│   │   └── schedules.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProjectForm.js
│   │   │   ├── ProjectList.js
│   │   │   └── ScheduleList.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   └── package.json
├── package.json
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Setup

1. **Clone/Extract the project**
   ```bash
   cd BBS
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env` in the backend folder
   ```bash
   cp backend/.env.example backend/.env
   ```
   - Edit `backend/.env` with your PostgreSQL credentials

4. **Start the application**
   ```bash
   npm run dev
   ```

   This will start both the backend (port 5000) and frontend (port 3000) simultaneously.

## Usage

1. **Access the application**: Open `http://localhost:3000` in your browser
2. **Create a Project**: Fill in the project details and click "Create Project"
3. **Add Schedules**: Select a project and add bar bending schedule details
4. **Manage Data**: Edit or delete projects and schedules as needed

## API Endpoints

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Schedules
- `GET /api/schedules/project/:projectId` - Get schedules for a project
- `POST /api/schedules` - Create new schedule
- `PUT /api/schedules/:id` - Update schedule
- `DELETE /api/schedules/:id` - Delete schedule

## Database Schema

### projects table
- id (UUID, Primary Key)
- name (VARCHAR)
- description (TEXT)
- location (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### schedules table
- id (UUID, Primary Key)
- project_id (UUID, Foreign Key)
- schedule_number (VARCHAR)
- bar_diameter (NUMERIC)
- bar_type (VARCHAR)
- quantity (INTEGER)
- length (NUMERIC)
- unit (VARCHAR)
- remarks (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

## Development

### Backend Development
```bash
cd backend
npm run dev
```

### Frontend Development
```bash
cd frontend
npm start
```

## License

MIT

## Support

For issues or questions, please create an issue in the project repository.
