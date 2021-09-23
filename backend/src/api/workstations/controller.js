module.exports = {
  addWorkstation: async (database, workstation) => {
    try {
      //inserts in db
      await database.execute('INSERT INTO workstations (name, type) VALUES ( ? , ? )', [
        workstation.name,
        workstation.type,
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

  getWorkstations: async (database) => {
    try {
      const [results] = await database.execute('SELECT * FROM workstations');
      database.end();
      return results;
    } catch (e) {
      console.error(e);
      return;
    }
  },

  updateWorkstation: async (database, workstationId, workstation) => {
    try {
      await database.execute('UPDATE workstations SET name = ?, state = ?, type = ? WHERE id = ?', [
        workstation.name,
        workstation.state,
        workstation.type,
        workstationId,
      ]);
      const [results] = await database.execute('SELECT * FROM workstations WHERE id = ?', [
        workstationId,
      ]);
      database.end();
      return results[0];
    } catch (e) {
      return e.code;
    }
  },

  deleteWorkstation: async (database, workstationId) => {
    try {
      const [results] = await database.execute('SELECT * FROM workstations WHERE id = ?', [
        workstationId,
      ]);
      if (results.length === 0) return false;
      await database.execute('DELETE FROM workstations WHERE id = ?', [workstationId]);
      return true;
    } catch (e) {
      console.error(e);
    }
  },
};
