const express = require('express');
const router = express.Router();
const maintenanceModel = require('../models/maintenance');

router.get('/', async (req, res) => {
  try {
    const requests = await maintenanceModel.getAllMaintenanceRequests();
    res.json(requests);
  } catch (error) {
    console.error('Get maintenance requests error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { subject, equipment_id, status_id, priority } = req.body;

    if (!subject || !equipment_id || !status_id || !priority) {
      return res.status(400).json({ message: 'Subject, equipment_id, status_id, and priority are required' });
    }

    const requestId = await maintenanceModel.createMaintenanceRequest({
      subject,
      equipment_id,
      status_id,
      priority
    });

    res.status(201).json({ message: 'Maintenance request created', id: requestId });
  } catch (error) {
    console.error('Create maintenance request error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

