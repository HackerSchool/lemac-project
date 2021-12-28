module.exports = {
  addEntries: async (database, istId, workstationId) => {
    try {
      await database.execute('INSERT INTO `entries` (ist_id, workstation_id) VALUES ( ? , ? )', [
        istId,
        workstationId,
      ]);
      const [results] = await database.execute('SELECT * FROM `entries` WHERE id=LAST_INSERT_ID()');
      return results[0];
    } catch (e) {
      console.error(e);
      return;
    }
  },
  getEntries: async (database, active = 0) => {
    // if active = 0 then all entries will be shown (there is no extra query), if = 1 only active entries will be shown
    try {
      if (active == 0) {
        const [results] = await database.execute('SELECT * FROM entries');
        return results;
      } else if (active == 1) {
        const [results] = await database.execute('SELECT * FROM entries WHERE active = 1');
        return results;
      } else return;
    } catch (e) {
      console.error(e);
      return;
    }
  },
};
