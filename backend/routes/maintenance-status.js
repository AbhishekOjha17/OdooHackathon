const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [statuses] = await db.execute('SELECT id, name FROM maintenance_status ORDER BY id');
    res.json(statuses);
  } catch (error) {
    console.error('Get maintenance status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

