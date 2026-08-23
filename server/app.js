const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || true }));
app.use(express.json({ limit: '2mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api', leaveRoutes);
app.use('/api/employees', employeeRoutes);

app.use((error, req, res, next) => {
  console.error(error);
  return res.status(500).json({ message: 'An unexpected server error occurred.' });
});

module.exports = app;
