const { asyncHandler } = require('../../middleware/requestHandler');
const { addHours, getHours, getIndividualHours, deleteHours } = require('./index');

module.exports = {
  init: (app) => {
    app.post('/loghours', asyncHandler(addHours));
    app.get('/loghours', asyncHandler(getHours));
    app.get('/loghours/self', asyncHandler(getIndividualHours));
    app.delete('/loghours/:id', asyncHandler(deleteHours));
  },
};
