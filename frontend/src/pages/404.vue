<template>
  <div>
    <v-container class="card">
      <h1>Page Not Found</h1>
      <v-btn class="primary" @click="goHome">Go back to homepage</v-btn>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'NotFoundPage',
  methods: {
    goHome() {
      window.location = '/';
    },
  },
};
</script>

<style scoped>
.card {
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  margin-top: 100px;
}
.card > h1 {
  margin: 20px;
}
</style>
