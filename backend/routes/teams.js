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

router.post('/', async (req, res) => {
  try {
    const { name, company_id, member_ids } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Team name is required' });
    }

    const teamId = await teamsModel.createTeam({
      name,
      company_id: company_id ? parseInt(company_id) : null,
      member_ids: member_ids || []
    });

    res.status(201).json({ message: 'Team created successfully', id: teamId });
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

