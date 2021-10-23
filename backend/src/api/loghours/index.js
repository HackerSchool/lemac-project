const controller = require('./controller');

module.exports = {
  verifiesUser: async (req, res) => {
    //verifies if the user exists and is authorized to do the operation
    if (!req.user || !req.user.admin) {
      res.sendStatus(401);
      return;
    }
  },
  addHours: async (req, res) => {
    if (req.body) {
      const data = await controller.addHours(req.db, req.body);
      if (data == 'ER_DUP_ENTRY') {
        res.status(409).send('duplicate entry');
        return;
      }
      const response = {
        entryH: data.entry_hours,
        exitH: data.exist_hours,
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
