const db = require("../db");

async function getAllTeams() {
  const [rows] = await db.execute(
    `SELECT 
      t.id,
      t.name,
      t.company_id,
      c.name AS company_name,
      GROUP_CONCAT(DISTINCT u.full_name) AS team_members
    FROM teams t
    LEFT JOIN team_members tm ON t.id = tm.team_id
    LEFT JOIN users u ON tm.user_id = u.id
    LEFT JOIN companies c ON t.company_id = c.id
    GROUP BY t.id, t.name, t.company_id, c.name
    ORDER BY t.id`
  );
  return rows;
}

async function createTeam(data) {
  const { name, company_id, member_ids } = data;

  const [result] = await db.execute(
    "INSERT INTO teams (name, company_id) VALUES (?, ?)",
    [name, company_id || null]
  );

  const teamId = result.insertId;

  // Add team members if provided
  if (member_ids && Array.isArray(member_ids) && member_ids.length > 0) {
    for (const userId of member_ids) {
      try {
        await db.execute(
          "INSERT INTO team_members (team_id, user_id) VALUES (?, ?)",
          [teamId, userId]
        );
      } catch (error) {
        // Ignore duplicate entries
        if (error.code !== "ER_DUP_ENTRY") {
          throw error;
        }
      }
    }
  }

  return teamId;
}

module.exports = {
  getAllTeams,
  createTeam,
};
