<template>
  <v-container class="container">
    <v-card class="card">
      <v-card-title class="headline">Hour Register</v-card-title>
      <v-card-subtitle>
        Please log your work hours for today, or press the skip button if you are not working in the
        lab today.
      </v-card-subtitle>
      <v-card-text>
        <LoginTimePicker @setStart="setStart" @setEnd="setEnd" />
      </v-card-text>
      <v-spacer vertical />
      <v-divider horizontal></v-divider>
      <v-card-actions>
        <v-spacer />
        <v-btn color="success" text>Skip</v-btn>
        <v-btn color="secondary" text>Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import LoginTimePicker from '../components/Login/LoginTimePicker.vue';
export default {
  name: 'LoginPage',
  components: {
    LoginTimePicker,
  },
  methods: {
    setStart(value) {
      console.log(value);
    },
    setEnd(value) {
      console.log(value);
    },
  },
};
</script>

<style scoped>
.container {
  width: 50%;
  margin-top: 10vh;
}
</style>
