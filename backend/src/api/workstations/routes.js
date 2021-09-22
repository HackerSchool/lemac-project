const { asyncHandler } = require('../../middleware/requestHandler');
const { addWorkstation, getWorkstations } = require('./index');

module.exports = {
  init: (app) => {
    app.post('/workstations', asyncHandler(addWorkstation));
    app.get('/workstations', asyncHandler(getWorkstations));
    app.put('/workstations/:id', asyncHandler(updateUser));
    app.delete('/workstations/:id', asyncHandler(deleteUser));
  },
};
