const controller = require('./controller');

module.exports = {
  addNotes: async (req, res) => {
    if (!req.user) {
      res.sendStatus(401);
      return;
    }
    if (req.body) {
      const data = await controller.addNotes(req.db, req.body, req.user.id);

      const response = {
        id: data.id,
        userId: data.user_id,
        createdAt: data.created_at,
        text: data.text,
      };
      res.json(response);
      return;
    }
    res.sendStatus(400);
  },

  getNotes: async (req, res) => {
    if (!req.note) {
      res.sendStatus(401);
      return
    }

    const data = await controller.getNotes(req.db);
    if (data.length === 0) {
      res.json([]);
      return;
    } else if (data.length > 0) {
      const response = data.map((x) => ({
        id: data.id,
        userId: data.user_id,
        createdAt: data.created_at,
        text: data.text,
      }));
      res.json(response);
      return;
    } else {
      res.sendStatus(400);
    }
  },

  updateNotes: async (req, res) => {
    if (!req.user || !req.user.admin) {
      res.sendStatus(401);
      return;
    }
    if (req.body && req.body.istId && req.body.istId.match(/^ist\d+$/) && req.body.name) {
      const data = await controller.updateNotes(req.db, req.params.id, req.body);
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
        userId: data.user_id,
        createdAt: data.created_at,
        text: data.text,
      };

      res.json(response);
      return;
    }
    res.sendStatus(400);
  },

  deleteNote: async (req, res) => {
    if (!req.user) {
      res.sendStatus(401);
      return;
    }
    try {
      const conf = await controller.deleteNote(req.db, req.params.id);
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
