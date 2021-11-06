module.exports = {
  addNotes: async (database, notes, userId) => {
    try {
      await database.execute(
        'INSERT INTO `notes` (user_id, created_at, text) VALUES ( ? , ? , ? )',
        [userId, notes.createdAt, notes.text]
      );
      const [results] = await database.execute('SELECT * FROM notes WHERE id=LAST_INSERT_ID()');
      database.end();
      return results[0];
    } catch (e) {
      console.error(e);
      return;
    }
  },
  updateNotes: async (database, userId, notes) => {
    try {
      await database.execute('UPDATE notes SET created_At = ?, text = ? WHERE user_id = ?', [
        notes.createdAt,
        notes.text,
        userId,
      ]);
      const [results] = await database.execute('SELECT * FROM notes WHERE user_id = ?', [userId]);
      database.end();
      return results[0];
    } catch (e) {
      return e.code;
    }
  },
};
