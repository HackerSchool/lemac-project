<template>
  <div v-if="getPermission === 1">
    <v-tabs grow>
      <v-tab key="1">Personal Hours</v-tab>
      <v-tab key="2">Calendar</v-tab>
      <v-tab key="3">Hour Table</v-tab>
      <v-tab-item>
        <v-container v-if="hours">
          <HourTable :prop-hours="hours" />
        </v-container>
      </v-tab-item>
      <v-tab-item>
        <v-container>
          <Calendar />
        </v-container>
      </v-tab-item>
      <v-tab-item>
        <v-container>
          <SumTable />
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
import HourTable from '@/components/Hours/HoursTable.vue';
import Calendar from '@/components/Hours/Calendar.vue';
import SumTable from '@/components/Hours/SumTable.vue';
import { getHoursSelf } from '@/api/hours.api';
import { mapGetters } from 'vuex';
export default {
  name: 'Hours',
  components: { HourTable, Calendar, SumTable },
  data() {
    return {
      hours: null,
    };
  },
  computed: {
    ...mapGetters('user', ['getPermission']),
  },
  async mounted() {
    this.$loading.show();
    let response = await getHoursSelf();

    let data = response.data.map((val) => {
      val.sold_amount = val.exit_number - val.entry_number;
      return val;
    });

    this.hours = data;
    this.$loading.hide();
  },
};
</script>

<style></style>
