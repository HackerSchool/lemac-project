<template>
  <v-app id="app" style="width: 100%; height: 100%">
    <notifications />
    <component :is="$route.meta.navBar"></component>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  name: 'App',

  data: () => ({
    //
  }),

  mounted() {
    const jwt = localStorage.getItem('token');
    if (jwt) {
      const res = parseJwt(jwt);
      const user = {
        id: res.id,
        istId: res.istId,
        name: res.name,
        active: res.active,
        admin: res.admin,
      };
      this.loginUser(user);
    }
  },

  methods: {
    ...mapActions('user', ['loginUser', 'logoutUser']),
  },
};

//gets the user data from the middle section of the jwt if its already present in local storage
function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
}
</script>

<style>
body,
html {
  padding: 0;
  margin: 0;
  width: 100%;
  min-height: 100vh;
  overflow-y: auto !important;
}
#app {
  background-color: var(--v-background-base);
}
</style>
