const { asyncHandler } = require('../../middleware/requestHandler');
const { addEntries, deleteEntrie, updateEntrie, getEntries } = require('./index');

module.exports = {
  init: (app) => {
    app.post('/entries', asyncHandler(addEntries));
    app.delete('/entries/:id', asyncHandler(deleteEntrie));
    app.put('/entries/:id', asyncHandler(updateEntrie));
    app.get('/entries', asyncHandler(getEntries));
  },
};
