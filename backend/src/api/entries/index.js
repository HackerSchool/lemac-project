const controller = require('./controller');
const workstationsController = require('../workstations/controller');

const getStatus = async (database, entrieId) => {
  const data = await controller.getEntrie(database, entrieId);
  if (data.active) {
    await workstationsController.changeOccupation(database, data.workstation_id, -1);
  }
}

module.exports = {
  addEntries: async (req, res) => {
    // if (!req.user) {
    //   res.sendStatus(401);
    //   return;
    // }

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
  deleteEntrie: async (req, res) => {
    //if (!req.user) {
      //res.sendStatus(401);
      //return;
    //}
    try {
      await getStatus(req.db, req.params.id);
      if (await controller.deleteEntrie(req.db, req.params.id)) {
        res.sendStatus(204);
        return;
      } else {
        res.sendStatus(404);
        return;
      }
    } catch (e) {
      res.sendStatus(400);
      return;
    }
  }
};
