const { asyncHandler } = require('backend/src/middleware/requestHandler');
const controller = require('./controller');

module.exports = {
  addEntries: async (req) => {
    //condição de erro aqui
    //condição
    const data = await controller.addEntries(req.db, req.body, req.workstations.id);

    const response = {
      workstationId: data.workstation_id,
      istId: data.ist_id,
    };
    response.json(response);
    return;
  },
};
