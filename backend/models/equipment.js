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
      wc.name AS work_center_name
    FROM equipment e
    LEFT JOIN equipment_categories ec ON e.category_id = ec.id
    LEFT JOIN work_centers wc ON e.work_center_id = wc.id
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
      wc.name AS work_center_name
    FROM equipment e
    LEFT JOIN equipment_categories ec ON e.category_id = ec.id
    LEFT JOIN work_centers wc ON e.work_center_id = wc.id
    WHERE e.id = ?`,
    [id]
  );
  return rows[0] || null;
}

module.exports = {
  getAllEquipment,
  getEquipmentById
};

