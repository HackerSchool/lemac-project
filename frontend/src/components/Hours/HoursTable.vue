<template>
  <v-data-table
    :headers="headers"
    :items="hours"
    sort-by="id"
    :sort-desc="true"
    class="elevation-1"
  >
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title>Hours</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="550px">
          <template #activator="{ on, attrs }">
            <v-btn color="secondary" dark class="mb-2" v-bind="attrs" v-on="on"> New Entry </v-btn>
          </template>
          <v-card>
            <v-form ref="form" lazy-validation @submit.prevent="save">
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
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
                          full-width
                          format="24hr"
                        >
                          <v-spacer />
                          <v-btn text color="success" @click="menu = false"> Cancel </v-btn>
                          <v-btn text color="secondary" @click="$refs.menu.save(editedItem.entry)">
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
                          full-width
                          format="24hr"
                        >
                          <v-spacer />
                          <v-btn text color="success" @click="menu2 = false"> Cancel </v-btn>
                          <v-btn text color="secondary" @click="$refs.menu2.save(editedItem.exit)">
                            OK
                          </v-btn>
                        </v-time-picker>
                      </v-menu>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedItem.entry_number"
                      label="Entry ticket"
                      prepend-icon="mdi-ticket-confirmation"
                      required
                      :rules="[() => !!editedItem.entry_number || 'This field is required']"
                    ></v-text-field>
                    <v-spacer />
                    <v-text-field
                      v-model="editedItem.exit_number"
                      label="Exit ticket"
                      prepend-icon="mdi-ticket-confirmation"
                    ></v-text-field>
                    <v-spacer />
                    <v-text-field
                      v-model="editedItem.safe_amount"
                      label="Money in safe"
                      prepend-icon="mdi-safe-square-outline"
                      required
                      :rules="[() => !!editedItem.safe_amount || 'This field is required']"
                    ></v-text-field>
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
      </v-toolbar>
    </template>
    <template #[`item.entry`]="{ item }">
      {{
        new Date(item.entry).toLocaleString(undefined, {
          dateStyle: 'short',
          timeStyle: 'short',
          timeZone: 'UTC',
        })
      }}
    </template>
    <template #[`item.exit`]="{ item }">
      {{
        new Date(item.exit).toLocaleString(undefined, {
          dateStyle: 'short',
          timeStyle: 'short',
          timeZone: 'UTC',
        })
      }}
    </template>
    <template #[`item.time`]="{ item }">
      {{ Math.floor(parseInt(item.time) / 60) }}h{{ parseInt(item.time % 60) || '' }}
    </template>
    <template #[`item.exit_number`]="{ item }">
      {{ item.exit_number != null ? item.exit_number : '-' }}
    </template>
    <template #[`item.sold_amount`]="{ item }">
      {{ item.sold_amount > 0 ? item.sold_amount : '-' }}
    </template>
    <template #[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
  </v-data-table>
</template>

<script>
import { createHours, deleteHours, updateHours, getLastEntry } from '@/api/hours.api';

export default {
  name: 'HourTable',
  props: {
    propHours: {
      type: Array,
      default() {
        return [
          {
            id: Number,
            entry: String,
            exit: String,
            time: Number,
            entry_number: Number,
            exit_number: Number,
            safe_amount: Number,
            sold_amount: Number,
          },
        ];
      },
    },
  },
  data: () => ({
    dialog: false,
    dialogDelete: false,
    hours: [],
    headers: [
      { text: 'Entry Hour', value: 'entry', sortable: false },
      { text: 'Exit Hour', value: 'exit', sortable: false },
      { text: 'Total Time', value: 'time', sortable: false },
      { text: 'Entry Ticket', value: 'entry_number', sortable: false },
      { text: 'Exit Ticket', value: 'exit_number', sortable: false },
      { text: 'Tickets Sold', value: 'sold_amount', sortable: false },
      { text: 'Money in Safe', value: 'safe_amount', sortable: false },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    menu: false,
    menu2: false,
    editedIndex: -1,
    editedItem: {
      entry: '',
      exit: '',
      entry_number: 0,
      exit_number: null,
      safe_amount: 0,
      sold_amount: 0,
    },
    defaultItem: {
      entry: '',
      exit: '',
      entry_number: 0,
      exit_number: null,
      safe_amount: 0,
      sold_amount: 0,
    },
    day: '',
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Hour Entry' : 'Edit Hour Entry';
    },
  },

  watch: {
    async dialog(val) {
      val || this.close();
      const lastEntry = (await getLastEntry()).data;
      this.editedItem.entry_number = lastEntry.exit_number;
      this.editedItem.safe_amount = lastEntry.safe_amount;
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  mounted() {
    this.hours = this.propHours;
  },
  methods: {
    editItem(item) {
      this.editedIndex = this.hours.indexOf(item);
      this.editedItem = {
        id: item.id,
        userId: item.userId,
        entry: new Date(item.entry).toLocaleTimeString(undefined, {
          timeStyle: 'short',
          timeZone: 'UTC',
          hourCycle: 'h23',
        }),
        exit: new Date(item.exit).toLocaleTimeString(undefined, {
          timeStyle: 'short',
          timeZone: 'UTC',
          hourCycle: 'h23',
        }),
        entry_number: item.entry_number,
        exit_number: item.exit_number,
        safe_amount: item.safe_amount,
        sold_amount: item.sold_amount,
      };
      this.day = item.entry.slice(0, 11);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.hours.indexOf(item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      try {
        await deleteHours(this.hours[this.editedIndex].id);
        const deleted = this.hours.splice(this.editedIndex, 1);
        this.$notify({
          type: 'success',
          title: 'Entry deleted',
          text: `You have deleted entry ${deleted[0].id}`,
        });
      } finally {
        this.closeDelete();
      }
    },

    close() {
      this.dialog = false;
      this.$refs.form.resetValidation();
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.day = '';
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.day = '';
      });
    },

    async save() {
      // Don't save if validation is unsuccessful
      if (!this.$refs.form.validate()) return;

      try {
        if (this.editedIndex > -1) {
          this.editedItem.entry = this.day + this.editedItem.entry + ':000Z';
          this.editedItem.exit = this.day + this.editedItem.exit + ':000Z';
          if (!this.editedItem.exit_number) {
            this.editedItem.exit_number = null;
          }
          const response = await updateHours(this.hours[this.editedIndex].id, this.editedItem);
          response.data.sold_amount = (response.data.exit_number ?? 0) - response.data.entry_number;

          this.hours.splice(this.editedIndex, 1, response.data);
          this.$notify({
            type: 'success',
            title: 'Entry updated',
            text: `You have updated entry ${response.data.id}`,
          });
        } else {
          const now = new Date().toJSON();
          this.editedItem.entry = now.slice(0, 11) + this.editedItem.entry + ':000Z';
          this.editedItem.exit = now.slice(0, 11) + this.editedItem.exit + ':000Z';
          if (!this.editedItem.exit_number) {
            this.editedItem.exit_number = null;
          }

          const response = await createHours(this.editedItem);
          response.data.sold_amount = response.data.exit_number - response.data.entry_number;

          this.hours.push(response.data);
          this.$notify({
            type: 'success',
            title: 'Entry created',
            text: `You have created entry ${response.data.id}`,
          });
        }
      } finally {
        this.close();
      }
    },
  },
};
</script>
