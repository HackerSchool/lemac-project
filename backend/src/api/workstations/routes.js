const { asyncHandler } = require('../../middleware/requestHandler');
const {
  addWorkstation,
  getWorkstations,
  updateWorkstation,
  deleteWorkstation,
} = require('./index');

module.exports = {
  init: (app) => {
    app.post('/workstations', asyncHandler(addWorkstation));
    app.get('/workstations', asyncHandler(getWorkstations));
    app.put('/workstations/:id', asyncHandler(updateWorkstation));
    app.delete('/workstations/:id', asyncHandler(deleteWorkstation));
  },
};
