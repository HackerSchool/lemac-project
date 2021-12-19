const { asyncHandler } = require('../../middleware/requestHandler');
const { addEntries } = require('./index');

module.exports = {
  init: (app) => {
    app.post('/entries', asyncHandler(addEntries));
  },
};
