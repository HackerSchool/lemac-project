const { asyncHandler } = require('../../middleware/requestHandler');
const { addEntries, getEntries } = require('./index');

module.exports = {
  init: (app) => {
    app.post('/entries', asyncHandler(addEntries));
    app.get('/entries', asyncHandler(getEntries));
  },
};
