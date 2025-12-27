const db = require('../db');

async function getAllMaintenanceRequests() {
  const [rows] = await db.execute(
    `SELECT 
      mr.id,
      mr.subject,
      mr.equipment_id,
      e.name AS equipment_name,
      e.serial_number AS equipment_serial,
      mr.status_id,
      ms.name AS status_name,
      mr.priority,
      mr.created_at
    FROM maintenance_requests mr
    LEFT JOIN equipment e ON mr.equipment_id = e.id
    LEFT JOIN maintenance_status ms ON mr.status_id = ms.id
    ORDER BY mr.created_at DESC`
  );
  return rows;
}

async function createMaintenanceRequest(data) {
  const { subject, equipment_id, status_id, priority } = data;
  
  const [result] = await db.execute(
    'INSERT INTO maintenance_requests (subject, equipment_id, status_id, priority) VALUES (?, ?, ?, ?)',
    [subject, equipment_id, status_id, priority]
  );
  
  return result.insertId;
}

module.exports = {
  getAllMaintenanceRequests,
  createMaintenanceRequest
};

