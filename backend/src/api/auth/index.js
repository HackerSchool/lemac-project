const controller = require('./controller');

module.exports = {
  loginFenix: async (req, res) => {
    const { code } = req.query;

    if (!code) {
      //no auth code sent by frontend
      res.sendStatus(400);
      return;
    }

    const { user, jwt } = await controller.loginFenix(req.db, code);

    if (!user || !jwt) {
      //user is not authorized to login, or login failed
      res.sendStatus(401);
      return;
    }
    res.json({ user, jwt });
  },
};
