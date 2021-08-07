const controller = require('./controller');

module.exports = {
  addUser: async (req, res) => {
    //verifies if the user exists to make sure its authorized to do the operation
    // if (!req.user) {
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
};
