require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { pool } = require('./db');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl} content-type=${req.headers['content-type']}`);
  next();
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Invalid JSON payload:', err.message);
    console.error('Raw request body:', req.rawBody);
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }
  next(err);
});

// PostgreSQL Connection Pool is provided by ./db

// Initialize database tables
async function initializeDatabase() {
  try {
    const client = await pool.connect();
    console.log('Connected to PostgreSQL');

    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        location VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS schedules (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        schedule_number VARCHAR(50) NOT NULL,
        bar_diameter NUMERIC(5,2) NOT NULL,
        bar_type VARCHAR(50),
        quantity INTEGER NOT NULL,
        length NUMERIC(10,2) NOT NULL,
        unit VARCHAR(20),
        weight NUMERIC(10,2),
        remarks TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query('ALTER TABLE schedules ADD COLUMN IF NOT EXISTS weight NUMERIC(10,2);');
    await client.query('ALTER TABLE schedules ADD COLUMN IF NOT EXISTS consumed_weight NUMERIC(10,2) DEFAULT 0;');

    await client.query(`
      CREATE TABLE IF NOT EXISTS schedule_details (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        schedule_id UUID NOT NULL REFERENCES schedules(id) ON DELETE CASCADE,
        mark_number VARCHAR(50) NOT NULL,
        diameter NUMERIC(5,2) NOT NULL,
        length NUMERIC(10,2) NOT NULL,
        quantity INTEGER NOT NULL,
        weight NUMERIC(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Database tables initialized');
    client.release();
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}

// API Routes
app.use('/api/projects', require('./routes/projects'));
app.use('/api/schedules', require('./routes/schedules'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  initializeDatabase();
});
