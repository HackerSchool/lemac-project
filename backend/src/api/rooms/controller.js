const services = require('./services');

module.exports = {
  getHoursFenix: async (database, roomId) => {
    try {
      let data = await services.getRoomData(roomId);

      return data;
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
        'SELECT l.*, u.name FROM `room_hours` l LEFT JOIN users u USING (user_id) WHERE YEAR(l.entry)=? AND MONTH(l.entry)=?',
        [year, month]
      );

      return results;
    } catch (e) {
      console.error(e);
      return;
    }
  },
  addHours: async (database, hours, userId, room, name, reservationId) => {
    try {
      await database.execute(
        'INSERT INTO `room_hours` (user_id, entry, `exit`, room, reservation_name, reservation_id) VALUES ( ? , ? , ? , ? , ? , ?)',
        [userId, hours.entry, hours.exit, room, name, reservationId]
      );

      const [results] = await database.execute(
        'SELECT * FROM room_hours WHERE id=LAST_INSERT_ID()'
      );
      return results[0];
    } catch (e) {
      console.error(e);
      return;
    }
  },
  deleteHours: async (database, id) => {
    try {
      const [results] = await database.execute('SELECT * FROM room_hours WHERE id=?', [id]);
      //only user can delete its own hours
      if (results.length === 0) return false;
      await database.execute('DELETE FROM room_hours WHERE id = ?', [id]);
      return true;
    } catch (e) {
      console.error(e);
    }
  },
  updateHours: async (database, hours, id, userId, room, name, reservationId, givenKey) => {
    try {
      const [check] = await database.execute('SELECT * FROM room_hours WHERE id=?', [id]);
      if (check.length === 0) return false;
      await database.execute(
        'UPDATE room_hours SET entry = ?, `exit` = ?, user_id = ?, room = ?, reservation_name = ?, reservation_id = ?, given_key = ? WHERE id = ?',
        [hours.entry, hours.exit, userId, room, name, reservationId, givenKey, id]
      );
      const [results] = await database.execute('SELECT * FROM room_hours WHERE id= ?', [id]);
      return results[0];
    } catch (e) {
      return e.code;
    }
  },
};
