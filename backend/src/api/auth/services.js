const axios = require('axios');
const { sign } = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'placeholder';

const FENIX_BASE_URL = process.env.FENIX_BASE_URL || 'https://fenix.tecnico.ulisboa.pt/';
const FENIX_CLIENT_ID = process.env.FENIX_CLIENT_ID || '';
const FENIX_CLIENT_SECRET = process.env.FENIX_CLIENT_SECRET || '';
const FENIX_REDIRECT_URL = process.env.FENIX_REDIRECT_URL || '';

module.exports = {
  /* createJWT creates the JWT from the user data to send to frontend*/
  createJWT: ({ user_id, ist_id, name, active, admin }) => {
    const data = { user_id, ist_id, name, active, admin };
    const token = sign(JWT_SECRET, data, { expiresIn: 60 * 60 * 24 * 7 });
    return token;
  },

  /* post request to Fenix API to authenticate the code from the frontend*/
  loginFenix: async (code) => {
    try {
      const response = axios.post(
        `${FENIX_BASE_URL}oauth/access_token?client_id=${encodeURIComponent(
          FENIX_CLIENT_ID
        )}&client_secret=${encodeURIComponent(
          FENIX_CLIENT_SECRET
        )}&redirect_uri=${encodeURIComponent(FENIX_REDIRECT_URL)}&code=${encodeURIComponent(
          code
        )}&grant_type=authorization_code`
      );
      console.log(response);
      return response.access_token;
    } catch (e) {
      console.error(e);
      return;
    }
  },
};
