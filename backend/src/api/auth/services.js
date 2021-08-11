const axios = require('axios');
const { sign } = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'placeholder';

const FENIX_BASE_URL = process.env.FENIX_BASE_URL || 'https://fenix.tecnico.ulisboa.pt/';
const FENIX_CLIENT_ID = process.env.FENIX_CLIENT_ID || '';
const FENIX_CLIENT_SECRET = process.env.FENIX_CLIENT_SECRET || '';
const FENIX_REDIRECT_URL = process.env.FENIX_REDIRECT_URL || '';

module.exports = {
  /* createJWT creates the JWT from the user data to send to frontend*/
  createJWT: ({ id, istId, name, active, admin }) => {
    const data = { id, istId, name, active, admin };
    const token = sign(data, JWT_SECRET, { expiresIn: 60 * 60 * 24 * 7 });
    return token;
  },

  /* post request to Fenix API to authenticate the code from the frontend*/
  loginFenix: async (code) => {
    try {
      const { data: response } = await axios.post(
        `${FENIX_BASE_URL}oauth/access_token?client_id=${encodeURIComponent(
          FENIX_CLIENT_ID
        )}&client_secret=${encodeURIComponent(
          FENIX_CLIENT_SECRET
        )}&redirect_uri=${encodeURIComponent(FENIX_REDIRECT_URL)}&code=${encodeURIComponent(
          code
        )}&grant_type=authorization_code`
      );
      return response.access_token;
    } catch (e) {
      console.error(e);
      return;
    }
  },

  /* get request to fenix api to get the user id */
  returnIstId: async (access_token) => {
    try {
      const { data: person } = await axios.get(`${FENIX_BASE_URL}api/fenix/v1/person`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      return person.username;
    } catch (e) {
      console.error(e);
      return;
    }
  },

  /* checks db for istid and returns the user info*/
  getUser: async (istId, database) => {
    try {
      const [results] = await database.execute('SELECT * FROM users WHERE ist_id=?', [istId]);
      database.end();
      if (results.length === 0) {
        return;
      } else {
        //estruturação em baixo do user object para mudar a conveção das variaveis e ter a certeza que se encontra bem estruturado
        const user = {
          id: results[0].user_id,
          istId: results[0].ist_id,
          name: results[0].name,
          active: results[0].active,
          admin: results[0].admin,
        };
        return user;
      }
    } catch (e) {
      console.error(e);
      return;
    }
  },
};
