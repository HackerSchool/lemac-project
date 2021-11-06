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
};
