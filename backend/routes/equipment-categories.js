const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [categories] = await db.execute(
      `SELECT 
        ec.id,
        ec.name,
        GROUP_CONCAT(DISTINCT t.name) AS responsible_teams,
        GROUP_CONCAT(DISTINCT c.name) AS companies
      FROM equipment_categories ec
      LEFT JOIN equipment e ON ec.id = e.category_id
      LEFT JOIN teams t ON e.maintenance_team_id = t.id
      LEFT JOIN companies c ON e.company_id = c.id
      GROUP BY ec.id, ec.name
      ORDER BY ec.name`
    );
    res.json(categories);
  } catch (error) {
    console.error('Get equipment categories error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const [result] = await db.execute(
      'INSERT INTO equipment_categories (name) VALUES (?)',
      [name]
    );

    res.status(201).json({ message: 'Equipment category created successfully', id: result.insertId });
  } catch (error) {
    console.error('Create equipment category error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

