const { pool } = require('../db');
const { v4: uuidv4 } = require('uuid');

const calculateWeight = (barDiameter, length, unit = 'meter') => {
  const lengthMeters = unit === 'feet' ? length * 0.3048 : length;
  if (!barDiameter || !lengthMeters) return 0;
  const weight = (barDiameter * barDiameter / 162) * lengthMeters;
  return parseFloat(weight.toFixed(2));
};

// Get all schedules for a project
exports.getSchedulesByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const result = await pool.query(
      'SELECT * FROM schedules WHERE project_id = $1 ORDER BY created_at DESC',
      [projectId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching schedules' });
  }
};

// Create new schedule
exports.createSchedule = async (req, res) => {
  try {
    const { projectId, scheduleNumber, barDiameter, barType, quantity, length, unit, remarks, consumedWeight } = req.body;
    const id = uuidv4();
    const weight = calculateWeight(barDiameter, length, unit);
    const consumed = parseFloat(consumedWeight) || 0;
    
    // Validate consumed weight doesn't exceed given weight
    if (consumed > weight) {
      return res.status(400).json({ error: 'Consumed weight cannot exceed given weight' });
    }
    
    const result = await pool.query(
      'INSERT INTO schedules (id, project_id, schedule_number, bar_diameter, bar_type, quantity, length, unit, weight, consumed_weight, remarks) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [id, projectId, scheduleNumber, barDiameter, barType, quantity, length, unit, weight, consumed, remarks]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating schedule' });
  }
};

// Update schedule
exports.updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { scheduleNumber, barDiameter, barType, quantity, length, unit, remarks, consumedWeight } = req.body;
    const weight = calculateWeight(barDiameter, length, unit);
    const consumed = parseFloat(consumedWeight) || 0;
    
    // Validate consumed weight doesn't exceed given weight
    if (consumed > weight) {
      return res.status(400).json({ error: 'Consumed weight cannot exceed given weight' });
    }
    
    const result = await pool.query(
      'UPDATE schedules SET schedule_number = $1, bar_diameter = $2, bar_type = $3, quantity = $4, length = $5, unit = $6, weight = $7, consumed_weight = $8, remarks = $9, updated_at = CURRENT_TIMESTAMP WHERE id = $10 RETURNING *',
      [scheduleNumber, barDiameter, barType, quantity, length, unit, weight, consumed, remarks, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating schedule' });
  }
};

// Delete schedule
exports.deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM schedules WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.json({ message: 'Schedule deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting schedule' });
  }
};

// Get weight report for a project
exports.getWeightReport = async (req, res) => {
  try {
    const { projectId } = req.params;
    const result = await pool.query(
      `SELECT 
        COALESCE(SUM(weight), 0) as total_given_weight,
        COALESCE(SUM(consumed_weight), 0) as total_consumed_weight,
        COALESCE(SUM(weight), 0) - COALESCE(SUM(consumed_weight), 0) as balance_weight,
        CASE 
          WHEN SUM(weight) = 0 THEN 0
          ELSE ROUND((COALESCE(SUM(consumed_weight), 0) / SUM(weight) * 100)::numeric, 2)
        END as percentage_consumed
      FROM schedules 
      WHERE project_id = $1`,
      [projectId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching weight report' });
  }
};
