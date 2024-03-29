<template>
  <v-data-table
    :headers="headers"
    :items="users"
    :search="search"
    sort-by="name"
    class="elevation-1"
  >
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title>Users</v-toolbar-title>
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
            <v-btn color="secondary" dark class="mb-2" v-bind="attrs" v-on="on"> New User </v-btn>
          </template>
          <v-card>
            <v-form ref="form" lazy-validation @submit.prevent="save">
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
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
                      :rules="[(v) => !!v || 'IST Id is required']"
                      label="Id"
                      required
                      filled
                    ></v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <v-select
                      v-model="editedItem.admin"
                      label="Role"
                      :items="roles"
                      filled
                    ></v-select>
                  </v-col>
                  <v-col cols="4">
                    <v-select
                      v-model="editedItem.active"
                      label="State"
                      :items="states"
                      filled
                    ></v-select>
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
    <template #[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
    <template #[`item.admin`]="{ item }">
      <v-chip :color="roleColors[item.admin]" dark class="capitalized">
        {{ (roles.find((v) => v.value == item.admin) || {}).text }}
      </v-chip>
    </template>
    <template #[`item.active`]="{ item }">
      <v-chip :color="stateColors[item.active]" dark class="capitalized">
        {{ (states.find((v) => v.value == item.active) || {}).text }}
      </v-chip>
    </template>
  </v-data-table>
</template>

<script>
import { createUser, deleteUser, updateUser } from '@/api/user.api';

export default {
  name: 'UserTable',
  props: {
    members: {
      type: Array,
      default() {
        return [
          {
            id: Number,
            name: String,
            istId: String,
            active: Number,
            admin: Number,
          },
        ];
      },
    },
  },
  data: () => ({
    dialog: false,
    dialogDelete: false,
    search: '',
    users: [],
    headers: [
      { text: 'Member', value: 'name' },
      { text: 'IST Id', value: 'istId' },
      { text: 'Role', value: 'admin', filterable: false },
      { text: 'State', value: 'active', filterable: false },
      { text: 'Actions', value: 'actions', sortable: false, filterable: false },
    ],
    editedIndex: -1,
    editedItem: {
      name: '',
    },
    defaultItem: {
      name: '',
      istId: '',
      admin: '',
      active: '',
    },
    roleColors: ['yellow darken-4', 'blue'],
    stateColors: ['grey', 'green'],
    roles: [
      { text: 'Admin', value: 1 },
      { text: 'User', value: 0 },
    ],
    states: [
      { text: 'Active', value: 1 },
      { text: 'Inactive', value: 0 },
    ],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New User' : 'Edit User';
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
    this.users = this.members;
  },
  methods: {
    editItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      try {
        await deleteUser(this.users[this.editedIndex].id);
        const deleted = this.users.splice(this.editedIndex, 1);
        this.$notify({
          type: 'success',
          title: 'User deleted',
          text: `You have deleted user ${deleted[0].name}`,
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
          const response = await updateUser(this.users[this.editedIndex].id, this.editedItem);
          this.users.splice(this.editedIndex, 1, response.data);
          this.$notify({
            type: 'success',
            title: 'User updated',
            text: `You have updated user ${response.data.name}`,
          });
        } else {
          const response = await createUser(this.editedItem);
          this.users.push(response.data);
          this.$notify({
            type: 'success',
            title: 'User created',
            text: `You have created user ${response.data.name}`,
          });
        }
      } finally {
        this.close();
      }
    },
  },
};
</script>
