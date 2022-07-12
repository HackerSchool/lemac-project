const { asyncHandler } = require('../../middleware/requestHandler');
const { getHours, addHours, deleteHours, updateHours } = require('./index');
const { getHoursFenix } = require('./index');

module.exports = {
  init: (app) => {
    app.get('/room-hours/fenix', asyncHandler(getHoursFenix));
    app.get('/room-hours', asyncHandler(getHours));
    app.post('/room-hours', asyncHandler(addHours));
    app.delete('/room-hours/:id', asyncHandler(deleteHours));
    app.put('/room-hours/:id', asyncHandler(updateHours));
  },
};
