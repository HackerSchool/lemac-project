module.exports = {
  addUser: async (database, user) => {
    try {
      //inserts in db
      await database.execute(
        'INSERT INTO users (ist_id, name, active, admin) VALUES ( ? , ? , ? , ? )',
        [user.istId, user.name, user.active, user.admin]
      );
      //gets inserted
      const [results] = await database.execute(
        'SELECT * FROM users WHERE user_id=LAST_INSERT_ID()'
      );
      return results[0];
    } catch (e) {
      return e.code;
    }
  },
};
