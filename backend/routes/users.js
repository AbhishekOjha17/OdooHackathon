const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const { role } = req.query;
    let query = 'SELECT id, full_name, email, role, company_id FROM users';
    const params = [];

    if (role) {
      query += ' WHERE role = ?';
      params.push(role);
    }

    const [users] = await db.execute(query, params);
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

