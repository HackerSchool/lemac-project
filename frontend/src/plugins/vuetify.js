import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

const vuetify = new Vuetify({
  theme: {
    light: true,
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        background: '#EEF2F5',
        primary: '#009de0',
        secondary: '#0076DC',
        accent: '#ffc15b',
        error: '#b71c1c',
        info: '#9cd49f',
        success: '#4CAF50',
        warning: '#FFC107',
      },
    },
  },
});

export default vuetify;
