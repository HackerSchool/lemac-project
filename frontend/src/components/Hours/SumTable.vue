<template>
  <v-data-table :headers="headers" :items="hours" sort-by="id" class="elevation-1">
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title>Weekly Hours</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="450px">
          <template #activator="{ on, attrs }">
            <v-btn color="secondary" dark class="mb-2" v-bind="attrs" v-on="on">
              <v-icon>mdi-calendar</v-icon>
            </v-btn>
          </template>
          <v-date-picker
            v-model="dates"
            class="py-3"
            range
            full-width
            no-title
            @change="update()"
          ></v-date-picker>
        </v-dialog>
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
    dialog: false,
    hours: [],
    dates: [],
    headers: [
      { text: 'Name', value: 'name' },
      { text: 'Time', value: 'time' },
    ],
  }),
  async mounted() {
    this.$loading.show();
    const date = new Date();
    date.setDate(date.getDate() - date.getDay());
    this.dates[0] = date.toISOString().slice(0, 10);
    date.setDate(date.getDate() + 6);
    this.dates[1] = date.toISOString().slice(0, 10);
    const response = await getSumHours(this.dates[0], this.dates[1]);
    this.hours = response.data;
    this.$loading.hide();
  },
  methods: {
    async update() {
      this.$loading.show();

      //reverses the array if the first element selected was the end
      if (new Date(this.dates[0]) > new Date(this.dates[1])) this.dates.reverse();

      const response = await getSumHours(this.dates[0], this.dates[1]);
      this.hours = response.data;
      this.$loading.hide();
    },
  },
};
</script>
