const state = {
  userId: '',
  istId: '',
  name: '',
  active: '',
  admin: '',
};

const getters = {};

const actions = {
  loginUser({ commit }, data) {
    commit('SET_USER', data);
  },
  logoutUser({ commit }) {
    commit('UNSET_USER');
  },
};

const mutations = {
  SET_USER(state, data) {
    //needs testing
    Object.assign(state, data);
  },
  UNSET_USER(state) {
    Object.keys(state).forEach((k) => (state[k] = null));
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
