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
  deleteEntrie: async (database, entrieId) => {
    try {
      const [results] = await database.execute('SELECT * FROM entries WHERE id = ?', [entrieId]);
      if (results.length === 0) return false;
      await database.execute('DELETE FROM entries WHERE id = ?', [entrieId]);
      return true;
    } catch (e) {
      console.error(e);
    }
  },
  getEntrie: async (database, entrieId) => {
    try {
      const [results] = await database.execute('SELECT * FROM entries WHERE id = ?', [entrieId]);
      return results[0];
    } catch (e) {
      console.error(e);
    }
  }
};
