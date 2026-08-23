const express = require('express');
const { changePassword, login } = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/login', login);
router.patch('/change-password', requireAuth, changePassword);
module.exports = router;