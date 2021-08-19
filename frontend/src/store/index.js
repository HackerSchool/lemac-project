import user from './user';

const state = {
  loadingBar: false,
};

const getters = {
  isLoading(state) {
    return state.loadingBar;
  },
};

const actions = {
  async showLoadingBar({ commit }) {
    commit('SET_LOADING_BAR', true);
  },
  async hideLoadingBar({ commit }) {
    commit('SET_LOADING_BAR', false);
  },
};

const mutations = {
  SET_LOADING_BAR(state, visible) {
    state.loadingBar = visible;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
  modules: {
    user,
  },
};
