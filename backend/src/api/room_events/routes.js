const { asyncHandler } = require('../../middleware/requestHandler');
const { createEvent, editEvent, getEvents, deleteEvents } = require('./index');

module.exports = {
  init: (app) => {
    app.get('/room-events', asyncHandler(getEvents));
    app.post('/room-events', asyncHandler(createEvent));
    app.put('/room-events/:id', asyncHandler(editEvent));
    app.delete('/room-events/:id', asyncHandler(deleteEvents));
  },
};
