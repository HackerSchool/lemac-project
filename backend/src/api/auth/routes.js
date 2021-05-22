const { asyncHandler } = require('../../middleware/requestHandler');
const { loginFenix } = require('./index');

module.exports = {
  init: (app) => {
    app.get('/auth/fenix', asyncHandler(loginFenix));
  },
};
