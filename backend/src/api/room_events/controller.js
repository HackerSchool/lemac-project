module.exports = {
  createEvent: async (database, type, userId, roomDataId) => {
    try {
      await database.execute(
        'INSERT INTO `room_events` (type, user_id, room_data_id) VALUES ( ? , ? , ? )',
        [type, userId, roomDataId]
      );

      const [results] = await database.execute(
        'SELECT * FROM room_events WHERE id=LAST_INSERT_ID()'
      );
      return results[0];
    } catch (e) {
      console.error(e);
      return;
    }
  },
  getEvents: async (database, start, finish) => {
    try {
      const [results] = await database.execute(
        `SELECT l.*, u.name FROM room_events l LEFT JOIN users u USING (user_id) WHERE l.created_at >= "${start} 00:00:00" AND l.created_at < "${finish} 23:59:59"`
      );
      return results;
    } catch (e) {
      console.error(e);
      return;
    }
  },
  editEvent: async (database, type, id, room_id, obs) => {
    try {
      const [check] = await database.execute('SELECT * FROM room_events WHERE id=?', [id]);
      if (check.length === 0) return false;
      await database.execute(
        'UPDATE room_events SET type = ?, room_data_id = ?, observations = ? WHERE id = ?',
        [type, room_id, obs, id]
      );
      const [results] = await database.execute('SELECT * FROM room_events WHERE id= ?', [id]);
      return results[0];
    } catch (e) {
      return e.code;
    }
  },
  deleteEvents: async (database, id, userId) => {
    try {
      const [results] = await database.execute('SELECT * FROM room_events WHERE id=?', [id]);
      //only user can delete its own hours
      if (results.length === 0 || userId !== results[0].user_id) return false;
      await database.execute('DELETE FROM room_events WHERE id = ?', [id]);
      return true;
    } catch (e) {
      console.error(e);
    }
  },
};
