const { asyncHandler } = require('../../middleware/requestHandler');
const { verifiesUser, addHours, getHours, getIndividualHours, deleteHours } = require('./index');

module.exports = {
  init: (app) => {
    app.post('/loghours', asyncHandler(addHours));
    app.get('/loghours', asyncHandler(getHours));
    app.get('/loghours/:id', asyncHandler(getIndividualHours));
    app.delete('/loghours/:id', asyncHandler(deleteHours));
  },
};
