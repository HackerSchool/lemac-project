import Vue from 'vue';
import App from './App.vue';
import router from './plugins/router';
import store from './plugins/store';
import vuetify from './plugins/vuetify';
import './plugins/notifications';

Vue.config.productionTip = false;

Vue.prototype.$loading = {
  show: function () {
    store.dispatch('showLoadingBar');
  },
  hide: function () {
    store.dispatch('hideLoadingBar');
  },
};

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
