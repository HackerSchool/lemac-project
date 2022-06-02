const controller = require('./controller');

module.exports = {
    addCard: async (req, res) => {
        if (!req.user) {
            res.sendStatus(401);
            return;
        }
        if (req.body && req.body.cardId) {
            const istId: getIstId(req.body.cardId), // função a criar of course
        };
    }
}