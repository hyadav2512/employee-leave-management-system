const express = require('express');
const { requireAuth } = require('../middleware/authMiddleware');
const { cancelLeave, createLeave, getLeave, getLeaveBalance, getLeaveTypes, getLeaves } = require('../controllers/leaveController');

const router = express.Router();
router.use(requireAuth);
router.get('/leave-types', getLeaveTypes);
router.get('/leave-balance', getLeaveBalance);
router.get('/leaves', getLeaves);
router.post('/leaves', createLeave);
router.get('/leaves/:id', getLeave);
router.patch('/leaves/:id/cancel', cancelLeave);

module.exports = router;
