const getTime = (entry, exit) => {
  try {
    //2021-10-23T05:30:00.000Z
    const timeIn = parseInt(entry.slice(11, 13), 10) * 60 + parseInt(entry.slice(14, 16), 10);
    const timeOut = parseInt(exit.slice(11, 13), 10) * 60 + parseInt(exit.slice(14, 16), 10);

    return timeOut - timeIn;
  } catch (e) {
    console.error(e);
    return;
  }
};

module.exports = {
  addHours: async (database, hours, userId) => {
    try {
      await database.execute(
        'INSERT INTO `log_hours` (user_id, entry, `exit`, time) VALUES ( ? , ? , ? , ? )',
        [userId, hours.entry, hours.exit, getTime(hours.entry, hours.exit)]
      );
      const [results] = await database.execute('SELECT * FROM log_hours WHERE id=LAST_INSERT_ID()');
      database.end();
      return results[0];
    } catch (e) {
      console.error(e);
      return;
    }
  },
  getHours: async (database, month, year) => {
    try {
      const [
        results,
      ] = await database.execute(
        'SELECT l.*, u.name FROM log_hours l LEFT JOIN users u USING (user_id) WHERE YEAR(l.entry)=? AND MONTH(l.entry)=?',
        [year, month]
      );
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
  updateHours: async (database, hours, id, userId) => {
    try {
      const [check] = await database.execute('SELECT * FROM log_hours WHERE id=?', [id]);
      if (check.length === 0 || userId !== check[0].user_id) return false;
      await database.execute('UPDATE log_hours SET entry = ?, `exit` = ?, time = ? WHERE id = ?', [
        hours.entry,
        hours.exit,
        getTime(hours.entry, hours.exit),
        id,
      ]);
      const [results] = await database.execute('SELECT * FROM log_hours WHERE id= ?', [id]);
      database.end();
      return results[0];
    } catch (e) {
      return e.code;
    }
  },
  deleteHours: async (database, id, userId) => {
    try {
      const [results] = await database.execute('SELECT * FROM log_hours WHERE id=?', [id]);
      //only user can delete its own hours
      if (results.length === 0 || userId !== results[0].user_id) return false;
      await database.execute('DELETE FROM log_hours WHERE id = ?', [id]);
      return true;
    } catch (e) {
      console.error(e);
    }
  },
};
