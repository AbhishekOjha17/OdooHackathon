const express = require('express');
const router = express.Router();
const equipmentModel = require('../models/equipment');

router.get('/', async (req, res) => {
  try {
    const equipment = await equipmentModel.getAllEquipment();
    res.json(equipment);
  } catch (error) {
    console.error('Get equipment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const equipment = await equipmentModel.getEquipmentById(id);

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    res.json(equipment);
  } catch (error) {
    console.error('Get equipment by id error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

