//const { default: user } = require('@/store/user.js'); isto criou-me isto não sei porquê????
const axios = require('axios');
const { sign } = require('jsonwebtoken');
const db = require('../../middleware/database.js');

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

  /* get request to fenix api to get the user id */
  returnIstId: async (access_token) => {
    try {
      const person = await axios.get(`${FENIX_BASE_URL}api/fenix/v1/person`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      console.log(person);
      return person.username;
    } catch (e) {
      console.error(e);
      return;
    }
  },

  /* checks db for istid and returns the user info NÃO SEI SE ISTO ESTÁ BEM PORQUE AINDA NÃO PERCEBI BEM SE O RESULt DÁ O QUE EU QUERO*/
  getUser: async (istId) => {
    var user;

    try {
      db.connect((err) => {
        if (err) throw err;
        db.query(
          `SELECT EXISTS(SELECT 1 FROM lemac_test.users WHERE ist_id = '${istId}')`,
          // eslint-disable-next-line no-unused-vars
          (err, result, fields) => {
            if (err) throw err;

            var dbname;
            var dbactive;
            var dbadmin;

            if (result == 1) {
              db.query(
                `SELECT name FROM lemac_test.users WHERE ist_id = '${istId}'`,
                // eslint-disable-next-line no-unused-vars
                (err, rows, fields) => {
                  if (err) throw err;

                  dbname = rows;
                }
              );

              db.query(
                `SELECT ative FROM lemac_test.users WHERE ist_id = '${istId}'`,
                // eslint-disable-next-line no-unused-vars
                (err, rows, fields) => {
                  if (err) throw err;

                  dbactive = rows;
                }
              );

              db.query(
                `SELECT admin FROM lemac_test.users WHERE ist_id = '${istId}'`,
                // eslint-disable-next-line no-unused-vars
                (err, rows, fields) => {
                  if (err) throw err;

                  dbadmin = rows;
                }
              );

              user = { name: `${dbname}`, active: `${dbactive}`, admin: `${dbadmin}` };
            }
          }
        );
      });

      return user;
    } catch (e) {
      console.error(e);
      return;
    }
  },
};
