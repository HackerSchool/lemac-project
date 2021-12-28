module.exports = {
  addNotes: async (database, notes, userId) => {
    try {
      await database.execute('INSERT INTO `notes` (user_id,  text) VALUES ( ? , ? )', [
        userId,
        notes.text,
      ]);
      const [results] = await database.execute('SELECT * FROM notes WHERE id=LAST_INSERT_ID()');
      return results[0];
    } catch (e) {
      console.error(e);
      return;
    }
  },

  getNotes: async (database) => {
    try {
      //is missing showing last five
      const [results] = await database.execute('SELECT * FROM notes ORDER BY id DESC LIMIT 5');
      return results;
    } catch (e) {
      console.error(e);
      return;
    }
  },

  updateNotes: async (database, id, notes) => {
    try {
      await database.execute('UPDATE notes SET text = ? WHERE id = ?', [notes.text, id]);
      const [results] = await database.execute('SELECT * FROM notes WHERE id = ?', [id]);
      return results[0];
    } catch (e) {
      return e.code;
    }
  },

  deleteNote: async (database, id) => {
    try {
      const [results] = await database.execute('SELECT * FROM notes WHERE id = ?', [id]);
      if (results.length === 0) return false;
      await database.execute('DELETE FROM users WHERE id = ?', [id]);
      return true;
    } catch (e) {
      console.error(e);
    }
  },
};
