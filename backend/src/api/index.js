const auth = require('./auth/routes');

module.exports = {
  /*export all routes into the main express file*/
  init: (app) => {
    auth.init(app);
  },
};
