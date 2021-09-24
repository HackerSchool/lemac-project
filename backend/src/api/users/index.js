const controller = require('./controller');

module.exports = {
  addUser: async (req, res) => {
    //verifies if the user exists to make sure its authorized to do the operation
    if (!req.user || !req.user.admin) {
      res.sendStatus(401);
      return;
    }

    //if the request body has proper structure inserts it db
    if (req.body && req.body.istId && req.body.istId.match(/^ist\d+$/) && req.body.name) {
      const data = await controller.addUser(req.db, req.body);
      if (data === 'ER_DUP_ENTRY') {
        res.status(409).send('duplicate entry');
        return;
      }
      const response = {
        id: data.user_id,
        istId: data.ist_id,
        name: data.name,
        active: data.active,
        admin: data.admin,
      };

      res.json(response);
      return;
    }
    res.sendStatus(400);
  },

  getUsers: async (req, res) => {
    //auth check
    if (!req.user) {
      res.sendStatus(401);
      return;
    }

    const data = await controller.getUsers(req.db);
    if (data.length === 0) {
      //no users in db
      res.json([]);
      return;
    } else if (data.length > 0) {
      const response = data.map((x) => ({
        id: x.user_id,
        istId: x.ist_id,
        name: x.name,
        active: x.active,
        admin: x.admin,
      }));
      res.json(response);
      return;
    } else {
      //bad request
      res.sendStatus(400);
    }
  },

  updateUser: async (req, res) => {
    if (!req.user || !req.user.admin) {
      res.sendStatus(401);
      return;
    }
    if (req.body && req.body.istId && req.body.istId.match(/^ist\d+$/) && req.body.name) {
      const data = await controller.updateUser(req.db, req.params.id, req.body);
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
        id: data.user_id,
        istId: data.ist_id,
        name: data.name,
        active: data.active,
        admin: data.admin,
      };

      res.json(response);
      return;
    }
    res.sendStatus(400);
  },

  deleteUser: async (req, res) => {
    if (!req.user || !req.user.admin) {
      res.sendStatus(401);
      return;
    }
    try {
      const conf = await controller.deleteUser(req.db, req.params.id);
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
