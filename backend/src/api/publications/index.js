const controller = require('./controller');

module.exports = {
  addPublication: async (req, res) => {
    if (!req.user || !req.user.admin) {
      res.sendStatus(401);
      return;
    }
    if (req.body && req.body.title && req.body.text) {
      const data = await controller.addPublication(req.db, req.body.title, req.body.text);

      const response = {
        id: data.id,
        title: data.title,
        text: data.text,
        createdAt: data.created_at,
        active: data.active,
      };
      res.json(response);
      return;
    } else {
      res.sendStatus(400);
      return;
    }
  },
  deletePublication: async (req, res) => {
    if (!req.user || !req.user.admin) {
      res.sendStatus(401);
      return;
    }
    try {
      if (await controller.deletePublication(req.db, req.params.id)) {
        res.sendStatus(204); // no content - success
        return;
      } else {
        res.sendStatus(404); // not found
        return;
      }
    } catch (e) {
      res.sendStatus(400);
      return;
    }
  },
};
