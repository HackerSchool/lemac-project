const auth = require('./auth/routes');
const users = require('./users/routes');
const workstations = require('./workstations/routes');
const loghours = require('./loghours/routes');
const entries = require('./entries/routes');
const publications = require('./publications/routes');
const roomhours = require('./rooms/routes');
const roomevents = require('./room_events/routes');

module.exports = {
  /*export all routes into the main express file*/
  init: (app) => {
    auth.init(app);
    users.init(app);
    workstations.init(app);
    loghours.init(app);
    entries.init(app);
    publications.init(app);
    roomhours.init(app);
    roomevents.init(app);
  },
};
