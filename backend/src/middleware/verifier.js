const jwt = require('jsonwebtoken');

const verifyMiddleware = async (req, res, next) => {
  //gets authorization header
  const authHeader = req.headers['authorization'];
  const header = authHeader && authHeader.split(' ');

  if (!header || header.length != 2 || header[0] != 'Bearer') {
    next();
    return;
  }

  //uses jwt to verify if the token is valid
  const token = header[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (!err && user.active) req.user = user;
    next();
  });
};

module.exports = {
  verifyMiddleware,
};
