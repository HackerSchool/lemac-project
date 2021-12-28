const controller = require('./controller');
const workstationsController = require('../workstations/controller');

module.exports = {
  addEntries: async (req, res) => {
    if (!req.user) {
      res.sendStatus(401);
      return;
    }

    if (
      req.body &&
      req.body.istId &&
      req.body.istId.match(/^ist\d+$/) &&
      req.body.workstationId &&
      (await workstationsController.checkWorkstation(req.db, req.body.workstationId))
    ) {
      const data = await controller.addEntries(req.db, req.body.istId, req.body.workstationId);

      workstationsController.changeOccupation(req.db, req.body.workstationId, 1);

      const response = {
        id: data.id,
        workstationId: data.workstation_id,
        istId: data.ist_id,
        createdAt: data.created_at,
        active: data.active,
        observations: data.observations,
      };
      res.json(response);
      return;
    } else {
      res.sendStatus(400);
      return;
    }
  },
  getEntries: async (req, res) => {
    // if (!req.user) {
    //   res.sendStatus(401);
    //   return;
    // }

    const data = await controller.getEntries(req.db, req.query.active);
    if (data.length === 0) {
      //no entries in db
      res.json([]);
      return;
    } else if (data.length > 0) {
      const response = data.map((x) => ({
        id: x.id,
        workstationId: x.workstation_id,
        istId: x.ist_id,
        createdAt: x.created_at,
        active: x.active,
        observations: x.observations,
      }));
      res.json(response);
      return;
    } else {
      res.sendStatus(400);
    }
  },
};
