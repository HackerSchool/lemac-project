const auth = require('./auth/routes');
const users = require('./users/routes');
const workstations = require('./workstations/routes');

module.exports = {
  /*export all routes into the main express file*/
  init: (app) => {
    auth.init(app);
    users.init(app);
    workstations.init(app);
  },
};
