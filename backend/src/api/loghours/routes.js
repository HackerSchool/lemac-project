const { asyncHandler } = require('../../middleware/requestHandler');
const { updateHours } = require('./controller');
const { addHours, getHours, getIndividualHours, deleteHours } = require('./index');

module.exports = {
  init: (app) => {
    app.post('/loghours', asyncHandler(addHours));
    app.get('/loghours', asyncHandler(getHours));
    app.get('/loghours/self', asyncHandler(getIndividualHours));
    app.get('/loghours/:hours', asyncHandler(updateHours));
    app.delete('/loghours/:id', asyncHandler(deleteHours));
  },
};
