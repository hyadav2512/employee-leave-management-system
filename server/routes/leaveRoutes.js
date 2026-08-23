const express = require('express');
const { requireAuth } = require('../middleware/authMiddleware');
const { createLeave, getLeaveBalance, getLeaveTypes } = require('../controllers/leaveController');

const router = express.Router();
router.use(requireAuth);
router.get('/leave-types', getLeaveTypes);
router.get('/leave-balance', getLeaveBalance);
router.post('/leaves', createLeave);

module.exports = router;
