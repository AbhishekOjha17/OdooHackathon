const express = require('express');
const router = express.Router();
const workCentersModel = require('../models/work-centers');

router.get('/', async (req, res) => {
  try {
    const workCenters = await workCentersModel.getAllWorkCenters();
    res.json(workCenters);
  } catch (error) {
    console.error('Get work centers error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      name,
      code,
      tag,
      alternative_workcenter_id,
      cost_per_hour,
      capacity,
      time_efficiency,
      oee_target
    } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Work center name is required' });
    }

    const workCenterId = await workCentersModel.createWorkCenter({
      name,
      code,
      tag,
      alternative_workcenter_id: alternative_workcenter_id ? parseInt(alternative_workcenter_id) : null,
      cost_per_hour: cost_per_hour ? parseFloat(cost_per_hour) : null,
      capacity,
      time_efficiency: time_efficiency ? parseFloat(time_efficiency) : null,
      oee_target: oee_target ? parseFloat(oee_target) : null
    });

    res.status(201).json({ message: 'Work center created successfully', id: workCenterId });
  } catch (error) {
    console.error('Create work center error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

