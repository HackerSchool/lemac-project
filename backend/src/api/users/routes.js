const { asyncHandler } = require('../../middleware/requestHandler');
const { addUser } = require('./index');

module.exports = {
  init: (app) => {
    app.post('/users', asyncHandler(addUser));
  },
};
