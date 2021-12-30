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
  getPublications: async (database, active = 0) => {
    // if active = 0 then all entries will be shown (there is no extra query), if = 1 only active entries will be shown
    try {
      if (active == 0) {
        const [results] = await database.execute('SELECT * FROM publications');
        return results;
      } else if (active == 1) {
        const [results] = await database.execute('SELECT * FROM publications WHERE active = 1');
        return results;
      }
    } catch (e) {
      console.error(e);
      return;
    }
  },
  updatePublication: async (database, publicationId, publication) => {
    try {
      await database.execute(
        'UPDATE publications SET title = ?, text = ?, active = ? WHERE id = ?',
        [publication.title, publication.text, publication.active, publicationId]
      );
      const [results] = await database.execute('SELECT * FROM publications WHERE id = ?', [
        publicationId,
      ]);
      return results[0];
    } catch (e) {
      return e.code;
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
    }
  },
};
