const { asyncHandler } = require('../../middleware/requestHandler');
const { addUser, getUsers, updateUser, deleteUser } = require('./index');

module.exports = {
  init: (app) => {
    app.post('/users', asyncHandler(addUser));
    app.get('/users', asyncHandler(getUsers));
    app.put('/user/:id', asyncHandler(updateUser));
    app.delete('/user/:id', asyncHandler(deleteUser));
  },
};
