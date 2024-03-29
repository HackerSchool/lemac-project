<template>
  <v-data-table
    :headers="headers"
    :items="publications"
    :search="search"
    sort-by="id"
    sort-desc
    class="elevation-1"
  >
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title>Announcements</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="550px">
          <template #activator="{ on, attrs }">
            <v-btn color="secondary" dark class="mb-2" v-bind="attrs" v-on="on">
              New Announcement
            </v-btn>
          </template>
          <v-card>
            <v-form ref="form" lazy-validation @submit.prevent="save">
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="10">
                    <v-text-field
                      v-model="editedItem.title"
                      :rules="[
                        (v) => !!v || 'Annoucement title is required',
                        (v) => v.length <= 255 || 'Title must be shorter',
                      ]"
                      label="Name"
                      required
                      counter="255"
                      filled
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2" class="px-5">
                    <!-- improve centering and design of switch-->
                    <v-switch v-model="editedItem.active" inset></v-switch>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="editedItem.text"
                      label="Body"
                      required
                      filled
                      counter
                      auto-grow
                    ></v-textarea>
                  </v-col>
                </v-row>
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
    <template #[`item.title`]="{ item }">
      {{ item.title.length > 30 ? item.title.slice(0, 30) + '...' : item.title }}
    </template>
    <template #[`item.text`]="{ item }">
      {{ item.text.length > 50 ? item.text.slice(0, 50) + '...' : item.text }}
    </template>
    <template #[`item.active`]="{ item }">
      <v-chip :color="item.active ? 'success' : 'error'" dark class="capitalized">
        {{ item.active ? 'Active' : 'Inactive' }}
      </v-chip>
    </template>
    <template #[`item.createdAt`]="{ item }">
      {{
        new Date(item.createdAt).toLocaleString(undefined, {
          dateStyle: 'short',
          timeStyle: 'short',
          timeZone: 'UTC',
        })
      }}
    </template>
    <template #[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
  </v-data-table>
</template>

<script>
import { addPublication, updatePublications, deletePublications } from '@/api/publications.api';

export default {
  name: 'PublicationsTable',
  props: {
    passedData: {
      type: Array,
      default() {
        return [
          {
            id: Number,
            title: String,
            text: String,
            active: Number,
            createdAt: String,
          },
        ];
      },
    },
  },
  data: () => ({
    dialog: false,
    dialogDelete: false,
    publications: [],
    search: '',
    headers: [
      { text: 'Title', value: 'title' },
      { text: 'Text', value: 'text', sortable: false },
      { text: 'Active', value: 'active', filterable: false },
      { text: 'Date', value: 'createdAt', filterable: false },
      { text: 'Actions', value: 'actions', sortable: false, filterable: false },
    ],
    editedIndex: -1,
    editedItem: {
      title: '',
      text: '',
      active: 0,
    },
    defaultItem: {
      title: '',
      text: '',
      active: 0,
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Annoucement' : 'Edit Announcement';
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
    this.publications = this.passedData;
  },
  methods: {
    editItem(item) {
      this.editedIndex = this.publications.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.publications.indexOf(item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      try {
        await deletePublications(this.publications[this.editedIndex].id);
        const deleted = this.publications.splice(this.editedIndex, 1);
        this.$notify({
          type: 'success',
          title: 'Announcement deleted',
          text: `You have deleted announcement ${deleted[0].title}`,
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
      try {
        if (this.editedIndex > -1) {
          const response = await updatePublications(this.publications[this.editedIndex].id, {
            ...this.editedItem,
            active: this.editedItem.active ? 1 : 0,
          });
          this.publications.splice(this.editedIndex, 1, response.data);
          this.$notify({
            type: 'success',
            title: 'Announcement updated',
            text: `You have updated announcement ${response.data.title}`,
          });
        } else {
          const response = await addPublication(this.editedItem);
          this.publications.push(response.data);
          this.$notify({
            type: 'success',
            title: 'Announcement created',
            text: `You have created announcement ${response.data.title}`,
          });
        }
      } finally {
        this.close();
      }
    },
  },
};
</script>
