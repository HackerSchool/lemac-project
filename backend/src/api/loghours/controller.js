module.exports = {
  addHours: async (database, entryHours) => {},
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
  getIndividualHours: async (database, user_id) => {
    try {
      const [results] = await database.execute('SELECT * FROM log_hours WHERE user_id=?', [
        user_id,
      ]);
      database.end();
      return results;
    } catch (e) {
      console.error(e);
      return;
    }
  },
};
