const { asyncHandler } = require('../../middleware/requestHandler');
const { addNotes, updateNotes, getNotes, deleteNote } = require('./index');

module.exports = {
  init: (app) => {
    app.post('/notes', asyncHandler(addNotes));
    app.put('/notes/:id', asyncHandler(updateNotes));
    app.get('/notes', asyncHandler(getNotes));
    app.delete('/notes', asyncHandler(deleteNote));
  },
};
