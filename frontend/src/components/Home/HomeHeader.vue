<template>
  <v-app-bar app dense>
    <h2 class="primary--text mx-3">LEMAC</h2>
    <v-spacer />
    <div v-if="!getId">
      <v-btn
        class="primary mx-3"
        :loading="loading"
        :disabled="loading"
        elevation="2"
        small
        @click="$emit('login')"
      >
        Login
      </v-btn>
    </div>
    <div v-else>
      <v-tooltip bottom open-delay="500">
        <template #activator="{ on, attrs }">
          <v-icon v-bind="attrs" @click="$router.push('dashboard')" v-on="on">
            mdi-view-dashboard
          </v-icon>
        </template>
        Admin Dashboard
      </v-tooltip>
      <v-btn
        class="error mx-3"
        :loading="loadingOut"
        :disabled="loadingOut"
        elevation="2"
        small
        @click="$emit('logout')"
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
  props: {
    loading: Boolean,
    loadingOut: Boolean,
  },
  computed: {
    ...mapGetters('user', ['getId']),
  },
};
</script>

<style></style>
