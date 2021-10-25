const { asyncHandler } = require('../../middleware/requestHandler');
const { loginFenix, userProfile } = require('./index');

module.exports = {
  init: (app) => {
    app.get('/auth/fenix', asyncHandler(loginFenix));
    app.get('/auth/profile', asyncHandler(userProfile));
  },
};
