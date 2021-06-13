const services = require('./services');

module.exports = {
  loginFenix: async (database, code) => {
    const accessToken = await services.loginFenix(code);
    if (!accessToken) return {};

    const istId = await services.returnIstId(accessToken);
    if (!istId) return {};

    const user = await services.getUser(istId);
    if (!user) return {};

    /*
    Missing database query that must check if the member exists and return the information, and build an object user with the information to be returned. done???
    */

    const jwt = services.createJWT(user);

    return { user, jwt };
  },
};
