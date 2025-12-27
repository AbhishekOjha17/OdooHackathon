const express = require('express');
const router = express.Router();
const maintenanceModel = require('../models/maintenance');

router.get('/', async (req, res) => {
  try {
    const requests = await maintenanceModel.getAllMaintenanceRequests();
    res.json(requests);
  } catch (error) {
    console.error('Get maintenance requests error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
    });
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const request = await maintenanceModel.getMaintenanceRequestById(id);

    if (!request) {
      return res.status(404).json({ message: 'Maintenance request not found' });
    }

    res.json(request);
  } catch (error) {
    console.error('Get maintenance request by id error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      subject,
      created_by,
      equipment_id,
      category_id,
      request_date,
      maintenance_type,
      team_id,
      technician_id,
      scheduled_date,
      duration,
      priority,
      status_id,
      company_id,
      notes,
      instructions
    } = req.body;

    if (!subject) {
      return res.status(400).json({ message: 'Subject is required' });
    }

    const requestId = await maintenanceModel.createMaintenanceRequest({
      subject,
      created_by: created_by || null,
      equipment_id: equipment_id || null,
      category_id: category_id || null,
      request_date: request_date || null,
      maintenance_type: maintenance_type || 'Corrective',
      team_id: team_id || null,
      technician_id: technician_id || null,
      scheduled_date: scheduled_date || null,
      duration: duration || null,
      priority: priority || 'Low',
      status_id: status_id || 1,
      company_id: company_id || null,
      notes: notes || null,
      instructions: instructions || null
    });

    res.status(201).json({ message: 'Maintenance request created', id: requestId });
  } catch (error) {
    console.error('Create maintenance request error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

