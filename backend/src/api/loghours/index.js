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

    if (
      req.body &&
      req.body.entry &&
      req.body.exit &&
      req.body.entry_number != null &&
      req.body.safe_amount != null
    ) {
      const body = {
        entry: timeJs2SQL(req.body.entry),
        exit: timeJs2SQL(req.body.exit),
      };

      const data = await controller.addHours(
        req.db,
        body,
        req.user.id,
        req.body.entry_number,
        req.body.exit_number,
        req.body.safe_amount
      );
      const response = {
        id: data.id,
        userId: data.user_id,
        entry: data.entry,
        exit: data.exit,
        time: data.time,
        entry_number: data.entry_number,
        exit_number: data.exit_number,
        safe_amount: data.safe_amount,
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

    const data = await controller.getHours(req.db, req.query.month, req.query.year);
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
        entry_number: x.entry_number,
        exit_number: x.exit_number,
        safe_amount: x.safe_amount,
        user: {
          name: x.name,
        },
      }));
      res.json(response);
      return;
    } else {
      //bad request
      res.sendStatus(400);
    }
  },
  updateHours: async (req, res) => {
    if (!req.user) {
      res.sendStatus(401);
      return;
    }

    if (
      req.body &&
      req.body.entry &&
      req.body.exit &&
      req.body.entry_number != null &&
      req.body.safe_amount != null
    ) {
      const body = {
        entry: timeJs2SQL(req.body.entry),
        exit: timeJs2SQL(req.body.exit),
      };
      //how to verifie that the hours exists in db
      const data = await controller.updateHours(
        req.db,
        body,
        req.params.id,
        req.user.id,
        req.body.entry_number,
        req.body.exit_number,
        req.body.safe_amount
      );
      if (!data) {
        res.sendStatus(404);
        return;
      }
      const response = {
        id: data.id,
        userId: data.user_id,
        entry: data.entry,
        exit: data.exit,
        time: data.time,
        entry_number: data.entry_number,
        exit_number: data.exit_number,
        safe_amount: data.safe_amount,
      };

      res.json(response);
      return;
    }
    res.sendStatus(400);
  },
  getIndividualHours: async (req, res) => {
    //auth check
    if (!req.user) {
      res.sendStatus(401);
      return;
    }

    const data = await controller.getIndividualHours(req.db, req.user.id);
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
        entry_number: x.entry_number,
        exit_number: x.exit_number,
        safe_amount: x.safe_amount,
      }));
      res.json(response);
      return;
    } else {
      //bad request
      res.sendStatus(400);
    }
  },

  deleteHours: async (req, res) => {
    if (!req.user) {
      res.sendStatus(401);
      return;
    }
    try {
      const conf = await controller.deleteHours(req.db, req.params.id, req.user.id);
      if (conf) {
        res.sendStatus(204);
        return;
      } else {
        res.sendStatus(404);
        return;
      }
    } catch (e) {
      res.sendStatus(400);
      return;
    }
  },

  getSum: async (req, res) => {
    if (!req.user && !req.user.admin) {
      res.sendStatus(401);
      return;
    }
    const data = await controller.getSum(req.db, req.query.start, req.query.finish);
    if (data.length === 0) {
      //no hours in db
      res.json([]);
      return;
    } else if (data.length > 0) {
      const response = data.map((x) => ({
        id: x.user_id,
        name: x.name,
        time: x.time,
      }));
      res.json(response);
      return;
    } else {
      //bad request
      res.sendStatus(400);
    }
  },

  lastEntry: async (req, res) => {
    if (!req.user && !req.user.admin) {
      res.sendStatus(401);
      return;
    }
    const data = await controller.lastEntry(req.db);
    if (data) {
      const response = {
        id: data.user_id,
        exit_number: data.exit_number,
        safe_amount: data.safe_amount,
      };
      res.json(response);
      return;
    } else {
      res.json([]);
    }
  },
};
