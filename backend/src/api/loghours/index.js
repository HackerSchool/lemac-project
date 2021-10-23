const controller = require('./controller');

//Functions to convert data types between mysql and javascript json
const timeJs2SQL = (jsTime) => {
  const sqlTime = jsTime.replace('T', ' ').slice(0, -1);
  return sqlTime;
};

module.exports = {
  addHours: async (req, res) => {
    if (!req.user) {
      res.sendStatus(401);
      return;
    }
    if (req.body) {
      const body = {
        entry: timeJs2SQL(req.body.entry),
        exit: timeJs2SQL(req.body.exit),
      };

      const data = await controller.addHours(req.db, body, req.user.id);

      const response = {
        id: data.id,
        userId: data.user_id,
        entry: data.entry,
        exit: data.exit,
        time: data.time,
      };
      res.json(response);
      return;
    }
    res.sendStatus(400);
  },
  getHours: async (req, res) => {
    //auth check
    if (!req.user || !req.user.admin) {
      res.sendStatus(401);
      return;
    }

    const data = await controller.getHours(req.db);
    if (data.length === 0) {
      //no hours in db
      res.json([]);
      return;
    } else if (data.length > 0) {
      const response = data.map((x) => ({
        id: x.id,
        userId: x.user_id,
        entry: x.entry,
        exit: x.exit,
        time: x.time,
      }));
      res.json(response);
      return;
    } else {
      //bad request
      res.sendStatus(400);
    }
  },
  getIndividualHours: async (req, res) => {
    //auth check
    if (!req.user) {
      res.sendStatus(401);
      return;
    }

    const data = await controller.getIndividualHours(req.db, req.user.user_id);
    if (data.length === 0) {
      //no hours in db
      res.json([]);
      return;
    } else if (data.length > 0) {
      const response = data.map((x) => ({
        id: x.id,
        userId: x.user_id,
        entry: x.entry,
        exit: x.exit,
        time: x.time,
      }));
      res.json(response);
      return;
    } else {
      //bad request
      res.sendStatus(400);
    }
  },
};
