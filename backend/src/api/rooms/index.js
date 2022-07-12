const controller = require('./controller');

const timeJs2SQL = (jsTime) => {
  const sqlTime = jsTime.replace('T', ' ').slice(0, -1);
  return sqlTime;
};

module.exports = {
  getHoursFenix: async (req, res) => {
    //auth check
    if (!req.user || !req.user.admin) {
      res.sendStatus(401);
      return;
    }

    const rooms = {
      SDM: 2448131364045,
      MOM: 2448131364044,
      LTI: 2448131364042,
    };

    let response = [];

    for (const key in rooms) {
      const data = await controller.getHoursFenix(req.db, rooms[key]);
      if (data) {
        const response_individual = data.events.map((x) => {
          let start = x.period.start.split('/');
          start = [start[1], start[0], start[2]];
          start = start.reduce((cur, prev) => `${cur}${prev}/`, '');

          let end = x.period.end.split('/');
          end = [end[1], end[0], end[2]];
          end = end.reduce((cur, prev) => `${cur}${prev}/`, '');

          return {
            title: x.title,
            entry: start.slice(0, -1),
            exit: end.slice(0, -1),
            description: x.description,
            room: data.name,
            id: `${data.name}-${start.slice(0, -1)}-${end.slice(0, -1)}`,
          };
        });

        response = [...response, ...response_individual];
      }
    }
    res.json(response);
  },
  getHours: async (req, res) => {
    if (!req.user || !req.user.admin) {
      res.sendStatus(401);
      return;
    }
    const data = await controller.getHours(req.db, req.query.month, req.query.year);

    if (data.length === 0) {
      res.json([]);
    } else if (data.length > 0) {
      const response = data.map((x) => ({
        id: x.id,
        userId: x.user_id,
        entry: x.entry,
        exit: x.exit,
        room: x.room,
        givenKey: x.given_key,
        user: {
          name: x.reservation_name,
          id: x.reservation_id,
        },
      }));
      res.json(response);
      return;
    } else {
      res.sendStatus(400);
    }
  },
  addHours: async (req, res) => {
    if (!req.user) {
      res.sendStatus(401);
      return;
    }

    if (req.body && req.body.entry && req.body.exit) {
      const body = {
        entry: timeJs2SQL(req.body.entry),
        exit: timeJs2SQL(req.body.exit),
      };

      const data = await controller.addHours(
        req.db,
        body,
        req.user.id,
        req.body.room,
        req.body.name,
        req.body.reservation_id
      );

      const response = {
        id: data.id,
        userId: data.user_id,
        entry: data.entry,
        exit: data.exit,
        room: data.room,
        givenKey: data.given_key,
        user: {
          name: data.reservation_name,
          id: data.reservation_id,
        },
      };
      res.json(response);
      return;
    }
    res.sendStatus(400);
  },

  deleteHours: async (req, res) => {
    if (!req.user) {
      res.sendStatus(401);
      return;
    }

    try {
      const conf = await controller.deleteHours(req.db, req.params.id);
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
  updateHours: async (req, res) => {
    if (!req.user) {
      res.sendStatus(401);
      return;
    }

    if (
      req.body &&
      req.body.entry &&
      req.body.exit &&
      req.body.room &&
      req.body.name &&
      req.body.reservation_id
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
        req.body.room,
        req.body.name,
        req.body.reservation_id,
        req.body.givenKey
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
        room: data.room,
        givenKey: data.given_key,
        user: {
          name: data.reservation_name,
          id: data.reservation_id,
        },
      };

      res.json(response);
      return;
    }
    res.sendStatus(400);
  },
};
