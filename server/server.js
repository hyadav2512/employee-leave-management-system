const express = require('express');
const cors = require('cors');

const { port } = require('./config/config');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const leaveRoutes = require('./routes/leaveRoutes');

const app = express();

app.use(cors());
app.use(express.json());

//Authentication routes
app.use('/api/auth', authRoutes);

//Dashboard routes
app.use('/api/dashboard', dashboardRoutes);

// Leave request routes
app.use('/api', leaveRoutes);

//Error handling middleware
app.use((error, req, res, next) => { console.error(error); res.status(500).json({ message: 'An unexpected server error occurred.' }); });

//Server listening
app.listen(port, () => console.log(`API server listening on port ${port}`));