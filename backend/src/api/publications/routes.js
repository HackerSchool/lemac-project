const { asyncHandler } = require('../../middleware/requestHandler');
const { addPublication, getPublication, updatePublication, deletePublication } = require('./index');

module.exports = {
  init: (app) => {
    app.post('/publication', asyncHandler(addPublication));
    app.get('/publication', asyncHandler(getPublication));
    app.put('/publication/:id', asyncHandler(updatePublication));
    app.delete('/publication/:id', asyncHandler(deletePublication));
  },
};
