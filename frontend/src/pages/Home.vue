<template>
  <div class="home">
    <HomeHeader @login="login" @logout="logout" :loading="loading" :loadingOut="loadingOut" />
  </div>
</template>

<script>
import HomeHeader from '@/components/Home/HomeHeader.vue';
import apiLogin from '@/api/auth.api';
import { mapActions } from 'vuex';
export default {
  name: 'Home',
  data: () => ({
    loading: false,
    loadingOut: false,
  }),
  components: {
    HomeHeader,
  },
  mounted() {
    const fenixCode = this.$route.query.code;
    if (fenixCode) this.authBackend(fenixCode);

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
    login() {
      window.location = `${process.env.VUE_APP_FENIX_BASE_URL}oauth/userdialog?client_id=${process.env.VUE_APP_FENIX_CLIENT_ID}&redirect_uri=${process.env.VUE_APP_FENIX_REDIRECT_URL}`;
    },
    //only runs after fenix login
    async authBackend(code) {
      this.loading = true;
      try {
        const { data } = await apiLogin(code);
        if (data.jwt) {
          localStorage.setItem('token', data.jwt);
          this.loginUser(data.user);
        }
      } catch (e) {
        this.$notify({
          type: 'error',
          title: 'Unauthorized user',
          text: "You don't have permission to access this ",
          duration: -1,
        });
      }
      this.loading = false;
      this.$router.push('/');
    },
    logout() {
      this.loadingOut = true;
      localStorage.removeItem('token');
      this.logoutUser();
      this.loadingOut = false;
    },
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
