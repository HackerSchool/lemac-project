const { asyncHandler } = require('../../middleware/requestHandler');
const { addNotes, updateNotes } = require('./index');

module.exports = {
  init: (app) => {
    app.post('/notes', asyncHandler(addNotes));
    app.put('/notes/:id', asyncHandler(updateNotes));
  },
};
