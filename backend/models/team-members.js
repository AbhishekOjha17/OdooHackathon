const db = require('../db');

async function addTeamMember(teamId, userId) {
  await db.execute(
    'INSERT INTO team_members (team_id, user_id) VALUES (?, ?)',
    [teamId, userId]
  );
}

module.exports = {
  addTeamMember
};

