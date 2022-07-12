const controller = require('./controller');

module.exports = {
  createEvent: async (req, res) => {
    if (!req.user) {
      res.sendStatus(401);
      return;
    }

    if (req.body && req.body.type && req.body.roomDataId) {
      const data = await controller.createEvent(
        req.db,
        req.body.type,
        req.user.id,
        req.body.roomDataId
      );

      const response = {
        id: data.id,
        userId: data.user_id,
        roomDataId: data.room_data_id,
        type: data.type,
        observations: data.observations,
        created_at: data.created_at,
      };
      res.json(response);
      return;
    }
    res.sendStatus(400);
  },
  getEvents: async (req, res) => {
    if (!req.user || !req.user.admin) {
      res.sendStatus(401);
      return;
    }
    const data = await controller.getEvents(req.db, req.query.start, req.query.finish);

    if (data.length === 0) {
      res.json([]);
    } else if (data.length > 0) {
      const response = data.map((x) => ({
        id: x.id,
        userId: x.user_id,
        roomId: x.room_data_id,
        type: x.type,
        observations: x.observations,
        created_at: x.created_at,
      }));
      res.json(response);
      return;
    } else {
      res.sendStatus(400);
    }
  },
  editEvent: async (req, res) => {
    if (!req.user) {
      res.sendStatus(401);
      return;
    }
    if (req.body && req.body.type && req.body.roomDataId) {
      //how to verifie that the hours exists in db
      const data = await controller.editEvent(
        req.db,
        req.body.type,
        req.params.id,
        req.body.roomDataId,
        req.body.observations
      );
      if (!data) {
        res.sendStatus(404);
        return;
      }
      const response = {
        id: data.id,
        userId: data.user_id,
        roomId: data.room_data_id,
        type: data.type,
        observations: data.observations,
        created_at: data.created_at,
      };

      res.json(response);
      return;
    }
    res.sendStatus(400);
  },
  deleteEvents: async (req, res) => {
    if (!req.user) {
      res.sendStatus(401);
      return;
    }
    try {
      const conf = await controller.deleteEvents(req.db, req.params.id, req.user.id);
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
};
