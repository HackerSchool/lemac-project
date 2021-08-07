const auth = require('./auth/routes');
const users = require('./users/routes');

module.exports = {
  /*export all routes into the main express file*/
  init: (app) => {
    auth.init(app);
    users.init(app);
  },
};
