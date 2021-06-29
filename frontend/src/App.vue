<template>
  <v-app id="app" style="width: 100%; height: 100%">
    <notifications />
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script>

<style>
body,
html {
  padding: 0;
  margin: 0;
  width: 100%;
  min-height: 100vh;
}
#app {
  background-color: var(--v-background-base);
}
</style>
