<template>
  <div class="home">
    <HomeHeader @login="login" :loading="loading" />
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
  }),
  components: {
    HomeHeader,
  },
  mounted() {
    const fenixCode = this.$route.query.code;
    if (fenixCode) this.authBackend(fenixCode);
  },
  methods: {
    login: () => {
      window.location = `${process.env.VUE_APP_FENIX_BASE_URL}oauth/userdialog?client_id=${process.env.VUE_APP_FENIX_CLIENT_ID}&redirect_uri=${process.env.VUE_APP_FENIX_REDIRECT_URL}`;
    },
    authBackend: async function (code) {
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
    ...mapActions('user', ['loginUser', 'logoutUser']),
  },
};
</script>
