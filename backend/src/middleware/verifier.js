// não sei se isto está bem aqui ou se é melhor ir para outro file

const { jwt } = require('jsonwebtoken');

const verifyMiddleware = async (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET); // req.token está certo???????

  let user = req.user;

  next();
};

module.exports = {
  verifyMiddleware,
};
