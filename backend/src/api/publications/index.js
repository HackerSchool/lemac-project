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
  getPublications: async (req, res) => {
    if (!req.user) {
      res.sendStatus(401);
      return;
    }

    const data = await controller.getPublications(req.db, req.query.active);
    if (data.length === 0) {
      res.json([]);
      return;
    } else if (data.length > 0) {
      const response = data.map((x) => ({
        id: x.id,
        title: x.title,
        text: x.text,
        createdAt: x.created_at,
        active: x.active,
      }));
      res.json(response);
      return;
    } else {
      res.sendStatus(400);
    }
  },
  updatePublications: async (req, res) => {
    if (!req.user || !req.user.admin) {
      res.sendStatus(401);
      return;
    }
    if (req.body && req.body.text && req.body.title && req.body.active) {
      const data = await controller.updatePublication(req.db, req.params.id, req.body);
      if (!data) {
        res.sendStatus(404);
        return;
      }
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
