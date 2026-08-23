const express = require('express');
const { requireAuth } = require('../middleware/authMiddleware');
const { getProfile, updateProfile } = require('../controllers/employeeController');

const router = express.Router();
router.use(requireAuth);
router.get('/me', getProfile);
router.patch('/me', updateProfile);

module.exports = router;
