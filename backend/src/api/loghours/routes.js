const { asyncHandler } = require('../../middleware/requestHandler');
const {addEntryHours, addExitHours} = require('./index');

module.exports = {
  init: (app) => {
    app.post('/loghours', asyncHandler(addEntryHours));
    app.post('/loghours', asyncHandler(addExitHours));
  },
};
