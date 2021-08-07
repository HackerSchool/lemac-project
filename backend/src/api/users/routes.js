const { asyncHandler } = require('../../middleware/requestHandler');
const { addUser, getUsers } = require('./index');

module.exports = {
  init: (app) => {
    app.post('/users', asyncHandler(addUser));
    app.get('/users', asyncHandler(getUsers));
  },
};
