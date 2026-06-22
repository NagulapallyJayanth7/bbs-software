const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

router.get('/project/:projectId', scheduleController.getSchedulesByProject);
router.post('/', scheduleController.createSchedule);
router.put('/:id', scheduleController.updateSchedule);
router.delete('/:id', scheduleController.deleteSchedule);

module.exports = router;
