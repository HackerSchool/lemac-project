<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat>
          <v-btn class="mr-4" color="secondary" @click="setToday"> Today </v-btn>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small> mdi-chevron-left </v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small> mdi-chevron-right </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu bottom right offset-y>
            <template #activator="{ on, attrs }">
              <v-btn color="secondary" v-bind="attrs" v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right> mdi-menu-down </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="75vh">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
        ></v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card v-if="selectedElement" color="grey lighten-4" min-width="250px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-toolbar-title v-if="selectedElement">{{
                selectedEvent.details.user.name
              }}</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <p>
                Entry:
                {{
                  new Date(selectedEvent.details.entry).toLocaleString(undefined, {
                    dateStyle: 'short',
                    timeStyle: 'short',
                    timeZone: 'UTC',
                  })
                }}
              </p>
              <p>
                Exit:
                {{
                  new Date(selectedEvent.details.exit).toLocaleString(undefined, {
                    dateStyle: 'short',
                    timeStyle: 'short',
                    timeZone: 'UTC',
                  })
                }}
              </p>
              <p>
                Time: {{ Math.floor(parseInt(selectedEvent.details.time) / 60) }}h{{
                  parseInt(selectedEvent.details.time % 60) || ''
                }}
              </p>
            </v-card-text>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import { getHours } from '@/api/hours.api';
export default {
  data: () => ({
    focus: '',
    type: 'month',
    typeToLabel: {
      month: 'Month',
      week: 'Week',
      day: 'Day',
    },
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
    requested: [],
  }),
  mounted() {
    this.$refs.calendar.checkChange();
  },
  methods: {
    viewDay({ date }) {
      this.focus = date;
      this.type = 'day';
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = '';
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() => requestAnimationFrame(() => (this.selectedOpen = true)));
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    async updateRange({ start, end }) {
      this.$loading.show();
      if (!this.requested.includes('' + start.month + start.year)) {
        await this.pushEvents(start.month, start.year);
        this.requested.push('' + start.month + start.year);
      }
      if (!this.requested.includes('' + end.month + end.year)) {
        await this.pushEvents(end.month, end.year);
        this.requested.push('' + end.month + end.year);
      }
      this.$loading.hide();
    },
    async pushEvents(month, year) {
      const events = [];
      const allHours = (await getHours(month, year)).data;
      //   const min = new Date(`${start.date}T00:00:00`);
      //   const max = new Date(`${end.date}T23:59:59`);
      for (let i = 0; i < allHours.length; i++) {
        events.push({
          name: allHours[i].user.name.split(' ')[0],
          start: new Date(allHours[i].entry),
          end: new Date(allHours[i].exit),
          color: this.colors[this.rnd(0, this.colors.length - 1)],
          timed: true,
          details: allHours[i],
        });
      }
      this.events = events.concat(this.events);
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
  },
};
</script>
