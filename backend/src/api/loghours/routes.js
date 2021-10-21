const { asyncHandler } = require('../../middleware/requestHandler');
const {verifiesUser, addHours} = require('./index');

module.exports = {
  init: (app) => {
    app.post('/loghours', asyncHandler(verifiesUser));
    app.post('/loghours', asyncHandler(addHours));
  },
};
