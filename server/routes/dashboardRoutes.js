const express = require('express');
const { getEmployeeDashboard } = require('../controllers/dashboardController');
const { requireAuth } = require('../middleware/authMiddleware');
const router = express.Router();
router.get('/employee', requireAuth, getEmployeeDashboard);
module.exports = router;