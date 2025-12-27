const db = require('../db');

async function getAllMaintenanceRequests() {
  const [rows] = await db.execute(
    `SELECT 
      mr.id,
      mr.subject,
      mr.created_by,
      u1.full_name AS employee_name,
      mr.equipment_id,
      e.name AS equipment_name,
      mr.category_id,
      ec.name AS category_name,
      mr.status_id,
      ms.name AS status_name,
      mr.priority,
      mr.technician_id,
      u2.full_name AS technician_name,
      mr.company_id,
      c.name AS company_name,
      mr.scheduled_date,
      mr.duration,
      mr.created_at
    FROM maintenance_requests mr
    LEFT JOIN users u1 ON mr.created_by = u1.id
    LEFT JOIN equipment e ON mr.equipment_id = e.id
    LEFT JOIN equipment_categories ec ON mr.category_id = ec.id
    LEFT JOIN maintenance_status ms ON mr.status_id = ms.id
    LEFT JOIN users u2 ON mr.technician_id = u2.id
    LEFT JOIN companies c ON mr.company_id = c.id
    ORDER BY mr.created_at DESC`
  );
  return rows;
}

async function getMaintenanceRequestById(id) {
  const [rows] = await db.execute(
    `SELECT 
      mr.id,
      mr.subject,
      mr.created_by,
      u1.full_name AS created_by_name,
      mr.equipment_id,
      e.name AS equipment_name,
      mr.category_id,
      ec.name AS category_name,
      mr.request_date,
      mr.maintenance_type,
      mr.team_id,
      t.name AS team_name,
      mr.technician_id,
      u2.full_name AS technician_name,
      mr.scheduled_date,
      mr.duration,
      mr.priority,
      mr.status_id,
      ms.name AS status_name,
      mr.company_id,
      c.name AS company_name,
      mr.notes,
      mr.instructions,
      mr.created_at
    FROM maintenance_requests mr
    LEFT JOIN users u1 ON mr.created_by = u1.id
    LEFT JOIN equipment e ON mr.equipment_id = e.id
    LEFT JOIN equipment_categories ec ON mr.category_id = ec.id
    LEFT JOIN maintenance_status ms ON mr.status_id = ms.id
    LEFT JOIN teams t ON mr.team_id = t.id
    LEFT JOIN users u2 ON mr.technician_id = u2.id
    LEFT JOIN companies c ON mr.company_id = c.id
    WHERE mr.id = ?`,
    [id]
  );
  return rows[0] || null;
}

async function createMaintenanceRequest(data) {
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
  } = data;
  
  const [result] = await db.execute(
    `INSERT INTO maintenance_requests (
      subject, created_by, equipment_id, category_id, request_date,
      maintenance_type, team_id, technician_id, scheduled_date,
      duration, priority, status_id, company_id, notes, instructions
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      subject, created_by, equipment_id, category_id, request_date,
      maintenance_type, team_id, technician_id, scheduled_date,
      duration, priority, status_id, company_id, notes, instructions
    ]
  );
  
  return result.insertId;
}

module.exports = {
  getAllMaintenanceRequests,
  getMaintenanceRequestById,
  createMaintenanceRequest
};

