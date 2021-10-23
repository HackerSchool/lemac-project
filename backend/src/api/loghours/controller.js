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
};
