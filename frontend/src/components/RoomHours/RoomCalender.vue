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
          <v-dialog v-model="dialog" max-width="550px" transition="dialog-transition">
            <template #activator="{ on, attrs }">
              <v-btn color="secondary" class="mr-4" v-bind="attrs" v-on="on">Add event</v-btn>
            </template>
            <v-card>
              <v-form ref="form" lazy-validation @submit.prevent="save">
                <v-card-title> Add event </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-menu
                        ref="menu3"
                        v-model="menu3"
                        :close-on-content-click="false"
                        :close-on-click="false"
                        :nudge-right="40"
                        :return-value.sync="editedItem.date"
                        transition="scale-transition"
                        offset-y
                      >
                        <template #activator="{ on, attrs }">
                          <v-text-field
                            v-model="editedItem.date"
                            label="Date for reservation"
                            prepend-icon="mdi-calendar"
                            readonly
                            required
                            :rules="[() => !!editedItem.date || 'This field is required']"
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-if="menu3"
                          v-model="editedItem.date"
                          :landscape="true"
                          :reactive="true"
                        >
                          <v-spacer />
                          <v-btn text color="success" @click="menu3 = false"> Cancel </v-btn>
                          <v-btn text color="secondary" @click="$refs.menu3.save(editedItem.date)">
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
                    </v-row>
                    <v-row>
                      <v-col cols="11" sm="5">
                        <v-menu
                          ref="menu"
                          v-model="menu"
                          :close-on-content-click="false"
                          :close-on-click="false"
                          :nudge-right="40"
                          :return-value.sync="editedItem.entry"
                          transition="scale-transition"
                          offset-y
                          max-width="290px"
                          min-width="290px"
                        >
                          <template #activator="{ on, attrs }">
                            <v-text-field
                              v-model="editedItem.entry"
                              label="Entry Hours"
                              prepend-icon="mdi-clock-time-four-outline"
                              readonly
                              required
                              :rules="[() => !!editedItem.entry || 'This field is required']"
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-time-picker
                            v-if="menu"
                            v-model="editedItem.entry"
                            :max="editedItem.exit"
                            :min="'9:00'"
                            full-width
                            format="24hr"
                          >
                            <v-spacer />
                            <v-btn text color="success" @click="menu = false"> Cancel </v-btn>
                            <v-btn
                              text
                              color="secondary"
                              @click="$refs.menu.save(editedItem.entry)"
                            >
                              OK
                            </v-btn>
                          </v-time-picker>
                        </v-menu>
                      </v-col>
                      <v-spacer></v-spacer>
                      <!--Exit hours menu-->
                      <v-col cols="11" sm="5">
                        <v-menu
                          ref="menu2"
                          v-model="menu2"
                          :close-on-content-click="false"
                          :close-on-click="false"
                          :nudge-right="40"
                          :return-value.sync="editedItem.exit"
                          transition="scale-transition"
                          offset-y
                          max-width="290px"
                          min-width="290px"
                        >
                          <template #activator="{ on, attrs }">
                            <v-text-field
                              v-model="editedItem.exit"
                              label="Exit Hours"
                              prepend-icon="mdi-clock-time-four-outline"
                              readonly
                              required
                              :rules="[() => !!editedItem.exit || 'This field is required']"
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-time-picker
                            v-if="menu2"
                            v-model="editedItem.exit"
                            :min="editedItem.entry"
                            :max="'21:00'"
                            full-width
                            format="24hr"
                          >
                            <v-spacer />
                            <v-btn text color="success" @click="menu2 = false"> Cancel </v-btn>
                            <v-btn
                              text
                              color="secondary"
                              @click="$refs.menu2.save(editedItem.exit)"
                            >
                              OK
                            </v-btn>
                          </v-time-picker>
                        </v-menu>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-text-field
                        id="name"
                        ref="name_field"
                        v-model="name"
                        name="name"
                        label="Name for reservation"
                        required
                        :rules="[() => !!name || 'This field is required']"
                      ></v-text-field>
                      <v-spacer></v-spacer>
                      <v-text-field
                        id="ist_id"
                        ref="ist_id_field"
                        v-model="ist_id"
                        name="ist_number"
                        label="Ist ID (ist1*)"
                        required
                        :rules="[() => !!ist_id || 'This field is required']"
                      ></v-text-field>
                    </v-row>
                    <v-row>
                      <v-select
                        v-model="roomDropdown"
                        :items="items"
                        label="Room"
                        required
                        :rules="[() => !!items || 'This field is required']"
                      ></v-select>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="close"> Cancel </v-btn>
                  <v-btn color="primary" text @click="save"> Save </v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-dialog>

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
                selectedEvent.details.title
              }}</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <p>
                Classroom: <b>{{ selectedEvent.details.room }}</b>
              </p>
              <p>
                Entry:
                {{
                  new Date(selectedEvent.details.entry).toLocaleString(undefined, {
                    dateStyle: 'long',
                    timeStyle: 'short',
                    timeZone: 'UTC',
                  })
                }}
              </p>
              <p>
                Exit:
                {{
                  new Date(selectedEvent.details.exit).toLocaleString(undefined, {
                    dateStyle: 'long',
                    timeStyle: 'short',
                    timeZone: 'UTC',
                  })
                }}
              </p>
              <span v-if="typeof selectedEvent.details.id === 'number'">
                <b>Oberservations:</b>
                <span v-for="event in selectedEvent.details.events" :key="event.id" center>
                  <p v-if="event.observations" style="margin-bottom: 0">
                    {{ event.observations }}
                  </p>
                </span>
              </span>
              <p v-else>Description: {{ selectedEvent.details.description }}</p>
            </v-card-text>
            <v-card-actions v-if="typeof selectedEvent.details.id === 'number'">
              <v-dialog v-model="dialogCard" max-width="550px" transition="dialog-transition">
                <template #activator="{ on, attrs }">
                  <v-btn color="primary" text v-bind="attrs" v-on="on">
                    <v-icon>mdi-pencil-outline</v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-form ref="form" lazy-validation @submit.prevent="save">
                    <v-card-title> Add event </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-menu
                            ref="menu4"
                            v-model="menu4"
                            :close-on-content-click="false"
                            :close-on-click="false"
                            :nudge-right="40"
                            :return-value.sync="editedItem.date"
                            transition="scale-transition"
                            offset-y
                          >
                            <template #activator="{ on, attrs }">
                              <v-text-field
                                v-model="editedItem.date"
                                label="Date for reservation"
                                prepend-icon="mdi-calendar"
                                readonly
                                required
                                :rules="[() => !!editedItem.date || 'This field is required']"
                                v-bind="attrs"
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-if="menu4"
                              v-model="editedItem.date"
                              :landscape="true"
                              :reactive="true"
                            >
                              <v-spacer />
                              <v-btn text color="success" @click="menu4 = false"> Cancel </v-btn>
                              <v-btn
                                text
                                color="secondary"
                                @click="$refs.menu4.save(editedItem.date)"
                              >
                                OK
                              </v-btn>
                            </v-date-picker>
                          </v-menu>
                        </v-row>
                        <v-row>
                          <v-col cols="11" sm="5">
                            <v-menu
                              ref="menu5"
                              v-model="menu5"
                              :close-on-content-click="false"
                              :close-on-click="false"
                              :nudge-right="40"
                              :return-value.sync="editedItem.entry"
                              transition="scale-transition"
                              offset-y
                              max-width="290px"
                              min-width="290px"
                            >
                              <template #activator="{ on, attrs }">
                                <v-text-field
                                  v-model="editedItem.entry"
                                  label="Entry Hours"
                                  prepend-icon="mdi-clock-time-four-outline"
                                  readonly
                                  required
                                  :rules="[() => !!editedItem.entry || 'This field is required']"
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-time-picker
                                v-if="menu5"
                                v-model="editedItem.entry"
                                :max="editedItem.exit"
                                :min="'9:00'"
                                full-width
                                format="24hr"
                              >
                                <v-spacer />
                                <v-btn text color="success" @click="menu5 = false"> Cancel </v-btn>
                                <v-btn
                                  text
                                  color="secondary"
                                  @click="$refs.menu5.save(editedItem.entry)"
                                >
                                  OK
                                </v-btn>
                              </v-time-picker>
                            </v-menu>
                          </v-col>
                          <v-spacer></v-spacer>
                          <!--Exit hours menu-->
                          <v-col cols="11" sm="5">
                            <v-menu
                              ref="menu6"
                              v-model="menu6"
                              :close-on-content-click="false"
                              :close-on-click="false"
                              :nudge-right="40"
                              :return-value.sync="editedItem.exit"
                              transition="scale-transition"
                              offset-y
                              max-width="290px"
                              min-width="290px"
                            >
                              <template #activator="{ on, attrs }">
                                <v-text-field
                                  v-model="editedItem.exit"
                                  label="Exit Hours"
                                  prepend-icon="mdi-clock-time-four-outline"
                                  readonly
                                  required
                                  :rules="[() => !!editedItem.exit || 'This field is required']"
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-time-picker
                                v-if="menu6"
                                v-model="editedItem.exit"
                                :min="editedItem.entry"
                                :max="'21:00'"
                                full-width
                                format="24hr"
                              >
                                <v-spacer />
                                <v-btn text color="success" @click="menu6 = false"> Cancel </v-btn>
                                <v-btn
                                  text
                                  color="secondary"
                                  @click="$refs.menu6.save(editedItem.exit)"
                                >
                                  OK
                                </v-btn>
                              </v-time-picker>
                            </v-menu>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-text-field
                            id="name"
                            ref="name_field"
                            v-model="name"
                            name="name"
                            label="Name for reservation"
                            required
                            :rules="[() => !!name || 'This field is required']"
                          ></v-text-field>
                          <v-spacer></v-spacer>
                          <v-text-field
                            id="ist_id"
                            ref="ist_id_field"
                            v-model="ist_id"
                            name="ist_number"
                            label="Ist ID (ist1*)"
                            required
                            :rules="[() => !!ist_id || 'This field is required']"
                          ></v-text-field>
                        </v-row>
                        <v-row>
                          <v-select
                            v-model="roomDropdown"
                            :items="items"
                            label="Room"
                            required
                            :rules="[() => !!roomDropdown || 'This field is required']"
                          ></v-select>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" text @click="close"> Cancel </v-btn>
                      <v-btn color="primary" text @click="update"> Update </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card>
              </v-dialog>

              <v-spacer></v-spacer>
              <v-btn v-if="!selectedEvent.givenKey" color="primary" text @click="giveKey()"
                >Give key</v-btn
              >
              <v-btn v-else color="primary" text @click="giveKey()">Receive key</v-btn>
              <v-btn color="primary" text @click="deleteEvent(selectedEvent.details)">Delete</v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import {
  getHoursFenix,
  getHours,
  createHours,
  deleteHours,
  updateHours,
} from '@/api/room_hours.api';
import { createEvent, getEvents } from '@/api/room_events.api';

export default {
  data: () => ({
    focus: '',
    type: 'week',
    typeToLabel: {
      month: 'Month',
      week: 'Week',
      day: 'Day',
    },
    menu: false,
    menu2: false,
    menu3: false,
    menu4: false,
    menu5: false,
    menu6: false,
    date: false,
    roomDropdown: '',
    dialog: false,
    dialogCard: false,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    colors: { SDM: 'blue', MOM: 'green', LTI: 'orange' },
    editedItem: {
      entry: '',
      exit: '',
      date: '',
    },
    requested: [],
    items: ['SDM', 'MOM', 'LTI'],
    name: '',
    ist_id: '',
  }),
  watch: {
    dialogCard(visible) {
      if (visible) {
        this.editedItem.date = this.selectedEvent.details.entry.split('T')[0];
        this.editedItem.entry = this.selectedEvent.details.entry.split('T')[1].slice(0, -5);
        this.editedItem.exit = this.selectedEvent.details.exit.split('T')[1].slice(0, -5);
        this.name = this.selectedEvent.details.user.name;
        this.ist_id = this.selectedEvent.details.user.id;
        this.roomDropdown = this.selectedEvent.details.room;
      } else if (!visible) {
        this.close();
      }
    },
    dialog(visible) {
      if (!visible) {
        this.close();
      }
    },
  },
  mounted() {
    this.$refs.calendar.checkChange();
  },
  methods: {
    viewDay({ date }) {
      this.focus = date;
      this.type = 'day';
    },

    getEventColor(event) {
      if (event.givenKey) {
        return `${event.color} darken-4`;
      } else {
        return event.color;
      }
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

      await this.pushEventsFenix();

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
      const date = new Date();
      const dates = [];
      date.setDate(date.getDate() - date.getDay());
      dates[0] = date.toISOString().slice(0, 10);
      date.setDate(date.getDate() + 6);
      dates[1] = date.toISOString().slice(0, 10);

      const events = [];
      const data = (await getHours(month, year)).data;
      const data_events = (await getEvents(dates[0], dates[1])).data;

      for (const event of data) {
        const data_event = data_events.filter((val) => val.roomId === event.id);
        event.title = `Reservation of ${event.user.name}`;
        event.events = data_event;

        events.push({
          name: event.title,
          start: new Date(event.entry),
          end: new Date(event.exit),
          color: this.colors[event.room],
          timed: true,
          id: event.id,
          givenKey: event.givenKey,
          details: event,
        });
      }

      this.events = events.concat(this.events);
    },

    async updateEvents(response) {
      const event = response.data;

      event.title = `Reservation of ${event.user.name}`;
      let found = false;
      this.events = this.events.map((value) => {
        if (value.id === event.id) {
          found = true;
          return {
            name: event.title,
            start: new Date(event.entry),
            end: new Date(event.exit),
            color: this.colors[event.room],
            timed: true,
            id: event.id,
            givenKey: event.givenKey,
            details: event,
          };
        } else {
          return value;
        }
      });

      if (!found) {
        let ev = {
          name: event.title,
          start: new Date(event.entry),
          end: new Date(event.exit),
          color: this.colors[event.room],
          timed: true,
          id: event.id,
          details: event,
        };
        this.events = [...this.events, ev];
      }
    },

    async pushEventsFenix() {
      const events = [];
      const data = (await getHoursFenix()).data;

      for (const event of data) {
        if (!this.events.find((el) => el.id === event.id)) {
          events.push({
            name: event.title,
            start: new Date(event.entry),
            end: new Date(event.exit),
            color: this.colors[event.room],
            timed: true,
            id: event.id,
            givenKey: false,
            details: event,
          });
        }
      }

      this.events = events.concat(this.events);
    },

    close() {
      this.dialog = false;
      this.dialogCard = false;
      this.$refs.form.resetValidation();
      this.$nextTick(() => {
        this.editedItem = {
          entry: '',
          exit: '',
          date: '',
        };
        this.day = '';
        this.name = '';
        this.room = '';
        this.ist_id = '';
      });
    },

    async save() {
      // Don't save if validation is unsuccessful
      if (!this.$refs.form.validate()) return;
      try {
        const addItem = {
          entry: `${this.editedItem.date}T${this.editedItem.entry}Z`,
          exit: `${this.editedItem.date}T${this.editedItem.exit}Z`,
          reservation_id: this.ist_id,
          room: this.roomDropdown,
          name: this.name,
        };

        const response = await createHours(addItem);
        await createEvent({
          type: 'res_created',
          roomDataId: response.data.id,
        });

        this.$notify({
          type: 'success',
          title: 'Entry created',
          text: `You have created entry ${response.data.id}`,
        });

        this.updateEvents(response);
        this.ist_id = '';
        this.name = '';
        this.roomDropdown = '';
      } finally {
        this.close();
      }
    },

    async update() {
      if (!this.$refs.form.validate()) return;
      try {
        const addItem = {
          entry: `${this.editedItem.date}T${this.editedItem.entry}Z`,
          exit: `${this.editedItem.date}T${this.editedItem.exit}Z`,
          reservation_id: this.ist_id,
          room: this.roomDropdown,
          name: this.name,
          givenKey: this.selectedEvent.details.givenKey,
        };

        const response = await updateHours(this.selectedEvent.details.id, addItem);

        await createEvent({
          type: 'res_updated',
          roomDataId: response.data.id,
        });

        this.$notify({
          type: 'success',
          title: 'Entry created',
          text: `You have created entry ${response.data.id}`,
        });

        this.updateEvents(response);
        this.ist_id = '';
        this.name = '';
        this.roomDropdown = '';
      } finally {
        this.close();
      }
    },

    async deleteEvent(event) {
      await deleteHours(event.id);
      this.events = this.events.filter((val) => val.id !== event.id);

      await createEvent({
        type: 'res_deleted',
        roomDataId: event.id,
      });

      this.$notify({
        type: 'success',
        title: 'Entry deleted',
        text: `You have deleted entry ${event.id}`,
      });
    },

    async giveKey() {
      try {
        const addItem = {
          entry: this.selectedEvent.details.entry,
          exit: this.selectedEvent.details.exit,
          reservation_id: this.selectedEvent.details.user.id,
          room: this.selectedEvent.details.room,
          name: this.selectedEvent.details.user.name,
          givenKey: !this.selectedEvent.givenKey,
        };

        const response = await updateHours(this.selectedEvent.details.id, addItem);

        await createEvent({
          type: this.selectedEvent.givenKey ? 'key_received' : 'key_given',
          roomDataId: response.data.id,
        });

        this.$notify({
          type: 'success',
          title: 'Key was given/received',
          text: `You have sucessfully given/received the key`,
        });

        this.updateEvents(response);
        this.ist_id = '';
        this.name = '';
        this.roomDropdown = '';
      } finally {
        this.selectedOpen = false;
      }
    },
  },
};
</script>
