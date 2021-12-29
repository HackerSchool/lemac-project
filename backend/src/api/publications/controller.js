module.exports = {
  addPublication: async (database, title, text) => {
    try {
      await database.execute('INSERT INTO publications (title, text) VALUES ( ? , ? )', [
        title,
        text,
      ]);
      const [results] = await database.execute(
        'SELECT * FROM publications WHERE id=LAST_INSERT_ID()'
      );
      return results[0];
    } catch (e) {
      console.error(e);
      return;
    }
  },
  deletePublication: async (database, id) => {
    try {
      const [results] = await database.execute('SELECT * FROM publications WHERE id = ?', [id]);
      if (results.length === 0) return false;
      await database.execute('DELETE FROM publications WHERE id = ?', [id]);
      return true;
    } catch (e) {
      console.error(e);
      return;
    }
  },
};
