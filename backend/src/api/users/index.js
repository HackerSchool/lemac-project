const controller = require('./controller');

module.exports = {
  addUser: async (req, res) => {
    //verifies if the user exists to make sure its authorized to do the operation
    // if (!req.user || !req.user.admin) {
    //   res.sendStatus(401);
    //   return;
    // }

    //if the request body has proper structure inserts it db
    if (req.body && req.body.istId && req.body.istId.match(/^ist\d+$/) && req.body.name) {
      const data = await controller.addUser(req.db, req.body);
      if (data === 'ER_DUP_ENTRY') {
        res.status(409).send('duplicate entry');
        return;
      }
      res.json(data);
      return;
    }
    res.sendStatus(400);
  },

  getUsers: async (req, res) => {
    //auth check
    // if (!req.user && !req.user.admin) {
    //   res.sendStatus(401);
    //   return;
    // }

    const data = await controller.getUsers(req.db);
    if (data.length === 0) {
      //no users in db
      res.sendStatus(204);
      return;
    } else if (data.length > 0) {
      res.json(data);
      return;
    } else {
      //bad request
      res.sendStatus(400);
    }
  },

  updateUser: async (req, res) => {
    // if (!req.user && !req.user.admin) {
    //   res.sendStatus(401);
    //   return;
    // }
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
      res.json(data);
      return;
    }
    res.sendStatus(400);
  },

  deleteUser: async (req, res) => {
    // if (!req.user && !req.user.admin) {
    //   res.sendStatus(401);
    //   return;
    // }
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
