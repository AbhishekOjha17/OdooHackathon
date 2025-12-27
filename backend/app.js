const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const equipmentRoutes = require('./routes/equipment');
const maintenanceRoutes = require('./routes/maintenance');
const teamsRoutes = require('./routes/teams');
const testRoutes = require('./routes/test');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/equipment', equipmentRoutes);
app.use('/maintenance', maintenanceRoutes);
app.use('/teams', teamsRoutes);
app.use('/test', testRoutes);

module.exports = app;

