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
};
