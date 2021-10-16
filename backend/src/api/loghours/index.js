const controller = require('./controller');

module.exports = {
    verifiesUser: async (req, res) => { //verifies if the user exists and is authorized to do the operation
        if (!req.user || !req.user.admin){
            res.sendStatus(401);
            return;
        }
    },
    addEntryHours: async(req, res) => {
        
    },
};
