<template>
  <v-data-table :headers="headers" :items="data" sort-by="id" class="elevation-1">
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title>Event List</v-toolbar-title>
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
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="error" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogObs" max-width="500px">
          <v-card>
            <v-form ref="formEdit" lazy-validation @submit.prevent="save">
              <v-card-title> Add observation </v-card-title>
              <v-card-text>
                <v-textarea
                  v-model="editedItem.observations"
                  filled
                  clearable
                  counter
                  auto-grow
                ></v-textarea>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="cancel()"> Cancel </v-btn>
                <v-btn color="primary" text @click="addObservation(editedItem)"> Save </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template #[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="openObservation(item)"> mdi-pencil </v-icon>
      <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
  </v-data-table>
</template>

<script>
import { getEvents, deleteEvent, updateEvent } from '@/api/room_events.api';
import { getUsers } from '@/api/user.api';
export default {
  name: 'SumTable',
  data: () => ({
    dialog: false,
    dialogDelete: false,
    dialogObs: false,
    data: [],
    editedIndex: 0,
    editedItem: {},
    dates: [],
    headers: [
      { text: 'Type', value: 'type' },
      { text: 'Reservation id', value: 'res' },
      { text: 'User', value: 'user' },
      { text: 'Created At', value: 'time' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
  }),
  watch: {
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  async mounted() {
    this.$loading.show();
    const date = new Date();
    date.setDate(date.getDate() - date.getDay());
    this.dates[0] = date.toISOString().slice(0, 10);
    date.setDate(date.getDate() + 6);
    this.dates[1] = date.toISOString().slice(0, 10);

    const data_response = (await getEvents(this.dates[0], this.dates[1])).data;
    const users = (await getUsers()).data;

    for (const value of data_response) {
      const user = users.find((val) => val.id === value.userId);
      this.data = [
        ...this.data,
        {
          type: `${this.getReservationText(value.type)}`,
          ogType: value.type,
          res: value.roomId,
          user: user.name,
          id: value.id,
          time: new Date(value.created_at).toLocaleString(undefined, {
            dateStyle: 'long',
            timeStyle: 'short',
            timeZone: 'UTC',
          }),
          observations: value.observations,
        },
      ];
    }

    this.$loading.hide();
  },

  methods: {
    async update() {
      this.$loading.show();
      this.data = [];

      if (new Date(this.dates[0]) > new Date(this.dates[1])) this.dates.reverse();

      const data_response = (await getEvents(this.dates[0], this.dates[1])).data;
      const users = (await getUsers()).data;

      for (const value of data_response) {
        const user = users.find((val) => val.id === value.userId);
        this.data = [
          ...this.data,
          {
            type: `${this.getReservationText(value.type)}`,
            ogType: value.type,
            res: value.roomId,
            user: user.name,
            id: value.id,
            time: new Date(value.created_at).toLocaleString(undefined, {
              dateStyle: 'long',
              timeStyle: 'short',
              timeZone: 'UTC',
            }),
            observations: value.observations,
          },
        ];
      }

      this.$loading.hide();
    },
    getReservationText(type) {
      switch (type) {
        case 'res_created':
          return 'Reservation created';
        case 'res_updated':
          return 'Reservation updated';
        case 'res_deleted':
          return 'Reservation deleted';
        case 'key_given':
          return 'Key given';
        case 'key_received':
          return 'Key received';
        default:
          return 'Unkown type';
      }
    },
    deleteItem(item) {
      this.editedIndex = this.data.indexOf(item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      console.log(this.data[this.editedIndex].id);
      try {
        await deleteEvent(this.data[this.editedIndex].id);
        const deleted = this.data.splice(this.editedIndex, 1);
        this.$notify({
          type: 'success',
          title: 'Entry deleted',
          text: `You have deleted entry ${deleted[0].id}`,
        });
      } finally {
        this.closeDelete();
      }
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.day = '';
      });
    },
    openObservation(item) {
      this.dialogObs = true;
      this.$nextTick(() => {
        this.editedIndex = this.data.indexOf(item);
        this.editedItem = Object.assign({}, item);
      });
    },
    async addObservation(item) {
      try {
        const updateItem = {
          type: item.ogType,
          roomDataId: item.res,
          observations: item.observations,
        };

        const response = (await updateEvent(item.id, updateItem)).data;

        this.data = this.data.map((val) => {
          if (val.id === response.id) {
            val.observations = response.observations;
          }

          return val;
        });

        this.$notify({
          type: 'success',
          title: 'Entry created',
          text: `You have created entry ${response.id}`,
        });
      } finally {
        this.dialogObs = false;
      }
    },
    cancel() {
      this.dialogObs = false;
    },
  },
};
</script>
