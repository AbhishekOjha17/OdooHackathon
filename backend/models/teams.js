const db = require('../db');

async function getAllTeams() {
  const [rows] = await db.execute(
    `SELECT 
      t.id,
      t.name,
      COUNT(tm.user_id) AS member_count
    FROM teams t
    LEFT JOIN team_members tm ON t.id = tm.team_id
    GROUP BY t.id, t.name
    ORDER BY t.id`
  );
  return rows;
}

module.exports = {
  getAllTeams
};

