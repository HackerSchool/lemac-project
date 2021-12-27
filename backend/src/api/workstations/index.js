const controller = require('./controller');

const types = ['active', 'disabled', 'remote'];

module.exports = {
  addWorkstation: async (req, res) => {
    //verifies if the user exists to make sure its authorized to do the operation
    if (!req.user || !req.user.admin) {
      res.sendStatus(401);
      return;
    }

    //if the request body has proper structure inserts it db
    if (
      req.body &&
      req.body.name &&
      !!req.body.capacity &&
      types.find((x) => x === req.body.type)
    ) {
      const data = await controller.addWorkstation(req.db, req.body);
      if (data === 'ER_DUP_ENTRY') {
        res.status(409).send('duplicate entry');
        return;
      }
      const response = {
        id: data.id,
        name: data.name,
        capacity: data.capacity,
        type: data.type,
        occupation: data.occupation,
      };

      res.json(response);
      return;
    }
    res.sendStatus(400);
  },

  getWorkstations: async (req, res) => {
    const data = await controller.getWorkstations(req.db);
    if (data.length === 0) {
      //no users in db
      res.json([]);
      return;
    } else if (data.length > 0) {
      const response = data.map((x) => ({
        id: x.id,
        name: x.name,
        capacity: x.capacity,
        type: x.type,
        occupation: x.occupation,
      }));
      res.json(response);
      return;
    } else {
      //bad request
      res.sendStatus(400);
    }
  },

  updateWorkstation: async (req, res) => {
    if (!req.user || !req.user.admin) {
      res.sendStatus(401);
      return;
    }
    if (req.body && req.body.name && types.find((x) => x === req.body.type)) {
      const data = await controller.updateWorkstation(req.db, req.params.id, req.body);
      //duplicated entry
      if (data === 'ER_DUP_ENTRY') {
        res.status(409).send('duplicate entry');
        return;
      }
      //no data found to update
      if (!data) {
        res.sendStatus(404);
        return;
      }
      const response = {
        id: data.id,
        name: data.name,
        occupation: data.occupation,
        capacity: data.capacity,
        type: data.type,
      };

      res.json(response);
      return;
    }
    res.sendStatus(400);
  },

  deleteWorkstation: async (req, res) => {
    if (!req.user || !req.user.admin) {
      res.sendStatus(401);
      return;
    }
    try {
      const conf = await controller.deleteWorkstation(req.db, req.params.id);
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
