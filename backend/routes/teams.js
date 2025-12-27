const express = require('express');
const router = express.Router();
const teamsModel = require('../models/teams');

router.get('/', async (req, res) => {
  try {
    const teams = await teamsModel.getAllTeams();
    res.json(teams);
  } catch (error) {
    console.error('Get teams error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

