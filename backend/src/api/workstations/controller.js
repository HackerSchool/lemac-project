module.exports = {
  addWorkstation: async (database, workstation) => {
    try {
      //inserts in db
      await database.execute('INSERT INTO workstations (name, workstation_type) VALUES ( ? , ? )', [
        workstation.name,
        workstation.workstationType,
      ]);
      //gets inserted
      const [results] = await database.execute(
        'SELECT * FROM workstations WHERE id=LAST_INSERT_ID()'
      );
      database.end();
      return results[0];
    } catch (e) {
      return e.code;
    }
  },

  getUsers: async (database) => {
    try {
      const [results] = await database.execute('SELECT * FROM workstations');
      database.end();
      return results;
    } catch (e) {
      console.error(e);
      return;
    }
  },

  updateUser: async (database, userId, user) => {
    try {
      await database.execute(
        'UPDATE users SET ist_id = ?, name = ?, active = ?, admin = ? WHERE user_id = ?',
        [user.istId, user.name, user.active, user.admin, userId]
      );
      const [results] = await database.execute('SELECT * FROM users WHERE user_id = ?', [userId]);
      database.end();
      return results[0];
    } catch (e) {
      return e.code;
    }
  },

  deleteUser: async (database, userId) => {
    try {
      const [results] = await database.execute('SELECT * FROM users WHERE user_id = ?', [userId]);
      if (results.length === 0) return false;
      await database.execute('DELETE FROM users WHERE user_id = ?', [userId]);
      return true;
    } catch (e) {
      console.error(e);
    }
  },
};
