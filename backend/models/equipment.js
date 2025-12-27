const db = require('../db');

async function getAllEquipment() {
  const [rows] = await db.execute(
    `SELECT 
      e.id,
      e.name,
      e.serial_number,
      e.category_id,
      ec.name AS category_name,
      e.work_center_id,
      wc.name AS work_center_name,
      e.employee_id,
      u1.full_name AS employee_name,
      e.department,
      e.technician_id,
      u2.full_name AS technician_name,
      e.company_id,
      c.name AS company_name
    FROM equipment e
    LEFT JOIN equipment_categories ec ON e.category_id = ec.id
    LEFT JOIN work_centers wc ON e.work_center_id = wc.id
    LEFT JOIN users u1 ON e.employee_id = u1.id
    LEFT JOIN users u2 ON e.technician_id = u2.id
    LEFT JOIN companies c ON e.company_id = c.id
    ORDER BY e.id`
  );
  return rows;
}

async function getEquipmentById(id) {
  const [rows] = await db.execute(
    `SELECT 
      e.id,
      e.name,
      e.serial_number,
      e.category_id,
      ec.name AS category_name,
      e.work_center_id,
      wc.name AS work_center_name,
      e.employee_id,
      u1.full_name AS employee_name,
      e.department,
      e.technician_id,
      u2.full_name AS technician_name,
      e.company_id,
      c.name AS company_name,
      e.maintenance_team_id,
      t.name AS maintenance_team_name,
      e.assigned_date,
      e.scrap_date,
      e.used_in_location,
      e.description
    FROM equipment e
    LEFT JOIN equipment_categories ec ON e.category_id = ec.id
    LEFT JOIN work_centers wc ON e.work_center_id = wc.id
    LEFT JOIN users u1 ON e.employee_id = u1.id
    LEFT JOIN users u2 ON e.technician_id = u2.id
    LEFT JOIN companies c ON e.company_id = c.id
    LEFT JOIN teams t ON e.maintenance_team_id = t.id
    WHERE e.id = ?`,
    [id]
  );
  return rows[0] || null;
}

async function createEquipment(data) {
  const {
    name,
    serial_number,
    category_id,
    work_center_id,
    employee_id,
    department,
    technician_id,
    company_id,
    maintenance_team_id,
    assigned_date,
    scrap_date,
    used_in_location,
    description
  } = data;

  const [result] = await db.execute(
    `INSERT INTO equipment (
      name, serial_number, category_id, work_center_id,
      employee_id, department, technician_id, company_id,
      maintenance_team_id, assigned_date, scrap_date, used_in_location, description
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      serial_number || null,
      category_id || null,
      work_center_id || null,
      employee_id || null,
      department || null,
      technician_id || null,
      company_id || null,
      maintenance_team_id || null,
      assigned_date || null,
      scrap_date || null,
      used_in_location || null,
      description || null
    ]
  );

  return result.insertId;
}

module.exports = {
  getAllEquipment,
  getEquipmentById,
  createEquipment
};

