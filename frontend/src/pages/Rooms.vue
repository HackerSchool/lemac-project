<template>
  <div v-if="getPermission === 1">
    <v-tabs grow>
      <v-tab key="1">Calendar</v-tab>
      <v-tab key="2">Event Log</v-tab>
      <v-tab-item>
        <v-container>
          <RoomCalenderVue />
        </v-container>
      </v-tab-item>
      <v-tab-item>
        <v-container>
          <EventLogVue />
        </v-container>
      </v-tab-item>
    </v-tabs>
  </div>

  <div v-else>
    <v-container v-if="hours" class="mt-6">
      <HourTable :prop-hours="hours" />
    </v-container>
  </div>
</template>

<script>
import RoomCalenderVue from '@/components/RoomHours/RoomCalender.vue';
import EventLogVue from '@/components/RoomHours/EventLog.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'Rooms',
  components: { RoomCalenderVue, EventLogVue },
  computed: {
    ...mapGetters('user', ['getPermission']),
  },
  methods: {
    goHome() {
      window.location = '/';
    },
  },
};
</script>
