<template>
  <div>
    <v-container v-if="hours" class="mt-6">
      <HourTable :prop-hours="hours" />
    </v-container>
  </div>
  <!-- TODO: tabs: if user is admin personal tab and all tab -->
</template>

<script>
import HourTable from '@/components/Hours/HoursTable.vue';
import { getHoursSelf } from '@/api/hours.api';
export default {
  name: 'Hours',
  components: { HourTable },
  data() {
    return {
      hours: null,
    };
  },
  async mounted() {
    this.$loading.show();
    const response = await getHoursSelf();
    this.hours = response.data;
    this.$loading.hide();
  },
};
</script>

<style></style>
