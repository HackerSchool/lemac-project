const { asyncHandler } = require('../../middleware/requestHandler');
const {
  addHours,
  getHours,
  getIndividualHours,
  deleteHours,
  updateHours,
  getSum,
  lastEntry,
} = require('./index');

module.exports = {
  init: (app) => {
    app.post('/loghours', asyncHandler(addHours));
    app.get('/loghours', asyncHandler(getHours));
    app.get('/loghours/self', asyncHandler(getIndividualHours));
    app.put('/loghours/:id', asyncHandler(updateHours));
    app.delete('/loghours/:id', asyncHandler(deleteHours));
    app.get('/loghours/sum', asyncHandler(getSum));
    app.get('/loghours/lastEntry', asyncHandler(lastEntry));
  },
};
