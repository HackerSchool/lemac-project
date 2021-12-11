<template>
  <v-data-table :headers="headers" :items="hours" sort-by="id" class="elevation-1">
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title>Weekly Hours</v-toolbar-title>
      </v-toolbar>
    </template>
    <template #[`item.time`]="{ item }">
      {{ Math.floor(parseInt(item.time) / 60) }}h{{ parseInt(item.time % 60) || '' }}
    </template>
  </v-data-table>
</template>

<script>
import { getSumHours } from '@/api/hours.api';

export default {
  name: 'SumTable',
  data: () => ({
    hours: [],
    headers: [
      { text: 'Name', value: 'name' },
      { text: 'Time', value: 'time' },
    ],
  }),

  async mounted() {
    const response = await getSumHours();
    this.hours = response.data;
  },
};
</script>
