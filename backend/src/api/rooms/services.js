const axios = require('axios');

module.exports = {
  getRoomData: async (roomCode) => {
    const { data: response } = await axios.get(
      `https://fenix.tecnico.ulisboa.pt/api/fenix/v1/spaces/${roomCode}`
    );

    return response;
  },
};
