const db = require('../db');

async function getAllWorkCenters() {
  const [rows] = await db.execute(
    `SELECT 
      wc.id,
      wc.name,
      wc.code,
      wc.tag,
      wc.alternative_workcenter_id,
      alt_wc.name AS alternative_workcenter_name,
      wc.cost_per_hour,
      wc.capacity,
      wc.time_efficiency,
      wc.oee_target
    FROM work_centers wc
    LEFT JOIN work_centers alt_wc ON wc.alternative_workcenter_id = alt_wc.id
    ORDER BY wc.id`
  );
  return rows;
}

async function createWorkCenter(data) {
  const {
    name,
    code,
    tag,
    alternative_workcenter_id,
    cost_per_hour,
    capacity,
    time_efficiency,
    oee_target
  } = data;

  const [result] = await db.execute(
    `INSERT INTO work_centers (
      name, code, tag, alternative_workcenter_id, cost_per_hour, capacity, time_efficiency, oee_target
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      code || null,
      tag || null,
      alternative_workcenter_id || null,
      cost_per_hour || null,
      capacity || null,
      time_efficiency || null,
      oee_target || null
    ]
  );

  return result.insertId;
}

module.exports = {
  getAllWorkCenters,
  createWorkCenter
};

