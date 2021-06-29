<template>
  <v-app-bar app dense>
    <h2 class="primary--text mx-3">LEMAC</h2>
    <v-spacer />
    <v-btn
      @click="$emit('login')"
      class="primary mx-3"
      :loading="loading"
      :disabled="loading"
      elevation="2"
      small
      >Login</v-btn
    >
  </v-app-bar>
</template>

<script>
export default {
  name: 'HomeHeader',
  props: ['loading'],
};
</script>

<style></style>
