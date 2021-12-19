module.exports = {
  addEntries: async (database, entries, istId, workstationId) => {
    try {
      await database.execute('INSERT INTO `entries` (ist_id, workstation_id) VALUES ( ? , ? )', [
        istId,
        workstationId, //como isto vem de outra tabela é assim né?? e não é preciso trazer o entries??
      ]);
      const [results] = await database.execute('SELECT * FROM `entries` WHERE id=LAST_INSERT_ID()');
      database.end();
      return results[0];
    } catch (e) {
      console.error(e);
      return;
    }
  },
};
