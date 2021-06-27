<template>
  <div class="about">
    <v-btn @click="login">Login</v-btn>
  </div>
</template>

<script>
import apiLogin from '@/api/auth.api';
export default {
  data() {
    return {};
  },
  mounted() {
    const fenixCode = this.$route.query.code;
    if (fenixCode) this.authBackend(fenixCode);
  },
  methods: {
    login: () => {
      window.location = `${process.env.VUE_APP_FENIX_BASE_URL}oauth/userdialog?client_id=${process.env.VUE_APP_FENIX_CLIENT_ID}&redirect_uri=${process.env.VUE_APP_FENIX_REDIRECT_URL}`;
    },
    authBackend: async (code) => {
      try {
        const { data } = await apiLogin(code);
        console.log(data);
        //this.$router.push('/');
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>
