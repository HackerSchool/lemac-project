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
        <v-btn color="success" text @click="$router.push('dashboard')">Skip</v-btn>
        <v-btn color="secondary" text :disabled="disabled" @click="saveTime">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import LoginTimePicker from '../components/Login/LoginTimePicker.vue';
import { createHours } from '@/api/hours.api';
export default {
  name: 'LoginPage',
  components: {
    LoginTimePicker,
  },
  data() {
    return {
      start: '',
      end: '',
    };
  },
  computed: {
    disabled() {
      return this.start && this.end ? false : true;
    },
  },
  methods: {
    setStart(value) {
      this.start = value;
    },
    setEnd(value) {
      this.end = value;
    },
    async saveTime() {
      const now = new Date().toJSON();
      const entry = now.slice(0, 11) + this.start + ':000Z';
      const exit = now.slice(0, 11) + this.end + ':000Z';
      try {
        await createHours({ entry: entry, exit: exit });
        this.$notify({
          type: 'success',
          title: 'Hours saved',
          text: `You have sucessfully saved your work hours for today`,
        });
      } catch (e) {
        console.error(e);
      } finally {
        this.$router.push('dashboard');
      }
      console.log(entry);
      console.log(exit);
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
