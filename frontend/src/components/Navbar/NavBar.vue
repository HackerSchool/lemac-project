<template>
  <div>
    <v-app-bar clipped-left app dense>
      <v-app-bar-nav-icon
        v-if="$vuetify.breakpoint.mdAndDown"
        color="primary"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-spacer />
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" clipped :permanent="$vuetify.breakpoint.lgAndUp" app>
      <v-list nav>
        <v-list-item-group v-for="(route, index) in routes" :key="index" v-model="group">
          <v-list-item
            v-if="getPermission >= (route.permission || 0)"
            :to="route.link"
            text
            color="primary"
            class="mb-1"
            @click.stop="drawer = !drawer"
          >
            <v-icon v-if="route.icon" left>
              {{ route.icon }}
            </v-icon>
            {{ route.text }}
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <template #append>
        <div class="pa-2">
          <v-btn block color="error" @click="onLogout">
            <v-icon left>mdi-logout</v-icon>Logout
          </v-btn>
          <div class="py-2 text-center">
            LEMAC
            <v-icon x-small>mdi-copyright</v-icon>
            {{ new Date().getFullYear() }}
          </div>
        </div>
      </template>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'NavBar',

  data() {
    return {
      drawer: false,
      group: null,
      routes: [
        {
          text: 'Home',
          icon: 'mdi-home',
          link: '/',
        },
        {
          text: 'Dashboard',
          icon: 'mdi-view-dashboard',
          link: '/dashboard',
        },
        // {
        //   text: 'Locations',
        //   icon: 'mdi-map-marker',
        //   link: '/locations',
        //   permission: 1, // admin only
        // }
      ],
    };
  },

  computed: {
    ...mapGetters('user', ['getPermission']),
  },

  watch: {
    group() {
      this.drawer = true;
    },
  },

  methods: {
    onLogout: function () {
      localStorage.removeItem('token');
      this.logoutUser();
      this.$router.push('login');
    },

    ...mapActions('user', ['logoutUser']),
  },
};
</script>
