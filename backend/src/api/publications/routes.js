const { asyncHandler } = require('../../middleware/requestHandler');
const { addPublication, deletePublication, updatePublications, getPublications } = require('./index');

module.exports = {
  init: (app) => {
    app.post('/publication', asyncHandler(addPublication));
    app.get('/publication', asyncHandler(getPublications));
    app.put('/publication/:id', asyncHandler(updatePublications));
    app.delete('/publication/:id', asyncHandler(deletePublication));
  },
};
