module.exports = {
  addHours: async (database, hours, userId) => {
    try {
      const time = 0;
      await database.execute(
        'INSERT INTO `log_hours` (user_id, entry, `exit`, time) VALUES ( ? , ? , ? , ? )',
        [userId, hours.entry, hours.exit, time]
      );
      const [results] = await database.execute('SELECT * FROM log_hours WHERE id=LAST_INSERT_ID()');
      database.end();
      return results[0];
    } catch (e) {
      console.error(e);
      return;
    }
  },
  getHours: async (database) => {
    try {
      const [results] = await database.execute('SELECT * FROM log_hours');
      database.end();
      return results;
    } catch (e) {
      console.error(e);
      return;
    }
  },
  getIndividualHours: async (database, userId) => {
    try {
      const [results] = await database.execute('SELECT * FROM log_hours WHERE user_id=?', [userId]);
      database.end();
      return results;
    } catch (e) {
      console.error(e);
      return;
    }
  },

  deleteHours: async (database, id) => {
    try {
      const [results] = await database.execute('SELECT * FROM log_hours WHERE id=?', [id]);
      if (results.length === 0) return false;
      await database.execute('DELETE FROM log_hours WHERE id = ?', [id]);
      return true;
    } catch (e) {
      console.error(e);
    }
  },
};
