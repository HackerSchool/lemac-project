<template>
  <v-app-bar app dense>
    <h2 class="primary--text mx-3">LEMAC</h2>
    <v-spacer />
    <div v-if="!this.getId">
      <v-btn
        @click="$emit('login')"
        class="primary mx-3"
        :loading="loading"
        :disabled="loading"
        elevation="2"
        small
      >
        Login
      </v-btn>
    </div>
    <div v-else>
      <v-btn
        @click="$emit('logout')"
        class="error mx-3"
        :loading="loadingOut"
        :disabled="loadingOut"
        elevation="2"
        small
      >
        Logout
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'HomeHeader',
  props: ['loading', 'loadingOut'],
  computed: {
    ...mapGetters('user', ['getId']),
  },
};
</script>

<style></style>
