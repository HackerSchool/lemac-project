const controller = require('./controller');

module.exports = {
    verifiesUser: async (req, res) => { //verifies if the user exists and is authorized to do the operation
        if (!req.user || !req.user.admin){
            res.sendStatus(401);
            return;
        }
    },
    addHours: async(req, res) => {
        if (req.body){
            const data = await controller.addHours(req.db, req.body);
            if (data == 'ER_DUP_ENTRY'){
                res.status(409).send('duplicate entry');
                return;
            }
            const response = {
                entryH: data.entry_hours,
                exitH: data.exist_hours,
                time: data.time,
            };
            res.json(response);
            return;
        }
        res.sendStatus(400);
    },
};
