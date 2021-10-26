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
        <v-dialog v-model="dialog" max-width="600px">
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
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.name"
                        :rules="[(v) => !!v || 'User name is required']"
                        label="Name"
                        required
                        filled
                      ></v-text-field>
                    </v-col>
                    <v-col cols="4">
                      <v-text-field
                        v-model="editedItem.istId"
                        :rules="[(v) => !!v || 'Ist Id is required']"
                        label="Id"
                        required
                        filled
                      ></v-text-field>
                    </v-col>
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
    <!-- TODO: time slot-->
    <template #[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
  </v-data-table>
</template>

<script>
import { createHours, deleteHours, updateHours } from '@/api/hours.api';

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
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    editedIndex: -1,
    editedItem: {},
    defaultItem: {
      entry: '',
      exit: '',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Hour Entry' : 'Edit Hour Entry';
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
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
      this.editedItem = Object.assign({}, item);
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
        // eslint-disable-next-line no-empty
      } catch (e) {}

      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$refs.form.resetValidation();
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      // Don't save if validation is unsuccessful
      if (!this.$refs.form.validate()) return;

      if (this.editedIndex > -1) {
        try {
          const response = await updateHours(this.hours[this.editedIndex].id, this.editedItem);
          this.hours.splice(this.editedIndex, 1, response.data);
          this.$notify({
            type: 'success',
            title: 'Entry updated',
            text: `You have updated entry ${response.data.id}`,
          });
          // eslint-disable-next-line no-empty
        } catch (e) {}
      } else {
        try {
          const response = await createHours(this.editedItem);
          this.hours.push(response.data);
          this.$notify({
            type: 'success',
            title: 'Entry created',
            text: `You have created entry ${response.data.id}`,
          });
          // eslint-disable-next-line no-empty
        } catch (e) {}
      }
      this.close();
    },
  },
};
</script>
