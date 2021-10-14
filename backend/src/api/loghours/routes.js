const { asyncHandler } = require('../../middleware/requestHandler');
const {} = require('./index');

module.exports = {
  init: (app) => {
    app.post('/loghours', asyncHandler(/*inserir aqui a função para o post request*/));
  },
};
