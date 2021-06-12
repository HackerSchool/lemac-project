const services = require('./services');

module.exports = {
  loginFenix: async (database, code) => {
    const accessToken = await services.loginFenix(code);
    if (!accessToken) return {};

    /*
    Needs a get request created in services.js with axios to return the istId (see response structure here: https://fenixedu.org/dev/api/#get-person).
    Similar to services.loginFenix, but should use the access token in the headers as bearer authorization.
    Don't forget to check for the existence of an answer.
    Missing database query that must check if the member exists and return the information, and build an object user with the information to be returned.
    */

    const user = await services.returnIstId(accessToken);
    if (!user) return {};

    const jwt = services.createJWT(user);

    return { user, jwt };
  },
};
