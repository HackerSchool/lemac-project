<template>
  <v-list class="elevation-1">
    <template v-if="entries.length > 0">
      <template v-for="(entry, index) in entries">
        <v-list-item :key="entry.id">
          <v-list-item-content>
            <v-list-item-title class="mb-2">
              <v-chip color="secondary">
                {{ entry.istId.slice(4) }}
              </v-chip>
            </v-list-item-title>
            <v-list-item-subtitle>
              <v-icon left right small>mdi-desktop-classic</v-icon> {{ entry.workstation.name }}
              <v-icon left right small>mdi-clock</v-icon>
              {{ new Date(entry.createdAt).toLocaleString('pt-PT') }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <div>
              <v-tooltip bottom open-delay="500">
                <template #activator="{ on, attrs }">
                  <v-btn
                    class="ma-1 info darken-1"
                    small
                    v-bind="attrs"
                    v-on="on"
                    @click="addObservation(entry)"
                  >
                    <v-icon>mdi-text</v-icon>
                  </v-btn>
                </template>
                Observations
              </v-tooltip>
              <v-tooltip bottom open-delay="500">
                <template #activator="{ on, attrs }">
                  <v-btn
                    class="ma-1 error"
                    small
                    v-bind="attrs"
                    v-on="on"
                    @click="closeEntry(entry)"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </template>
                Close Entry
              </v-tooltip>
            </div>
          </v-list-item-action>
        </v-list-item>
        <v-divider v-if="index < entries.length - 1" :key="index"></v-divider>
      </template>
    </template>
    <!-- template for empty list -->
    <template v-else>
      <v-list-item key="0"> There are no active entries in the lab! </v-list-item>
    </template>
    <v-dialog v-model="dialog" max-width="550px">
      <v-card>
        <v-form ref="form" lazy-validation @submit.prevent="save">
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-textarea v-model="editedItem.observations" filled clearable counter></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="observationsClose"> Cancel </v-btn>
            <v-btn color="primary" text @click="observationsSave"> Save </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogClose" max-width="500px">
      <v-card>
        <v-card-title class="headline">Are you sure you want to close this entry?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="closeCancel">Cancel</v-btn>
          <v-btn color="error" text @click="closeConfirm">Close</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-list>
</template>

<script>
import { getEntries, updateEntry } from '@/api/entries.api';
export default {
  data() {
    return {
      entries: [],
      editedItem: {
        active: 1,
        observations: '',
      },
      dialog: false,
      dialogClose: false,
      editedIndex: -1,
    };
  },
  computed: {
    formTitle() {
      return this.editedItem === -1 ||
        (this.entries[this.editedIndex]?.observations ?? '').length === 0
        ? 'Add Observations'
        : 'Edit Observations';
    },
  },
  async mounted() {
    this.$loading.show();
    const { data } = await getEntries(1);
    this.entries = data;
    console.log(data);
    this.$loading.hide();
  },
  methods: {
    addObservation(item) {
      this.editedIndex = this.entries.indexOf(item);
      this.editedItem = {
        active: item.active,
        observations: item.observations,
      };
      this.dialog = true;
    },
    closeEntry(item) {
      this.editedIndex = this.entries.indexOf(item);
      this.dialogClose = true;
    },
    closeCancel() {
      this.dialogClose = false;
      this.$nextTick(() => {
        this.editedIndex = -1;
      });
    },
    async closeConfirm() {
      try {
        await updateEntry(this.entries[this.editedIndex].id, { active: 0 });
        const closed = this.entries.splice(this.editedIndex, 1);
        this.$notify({
          type: 'success',
          title: 'Entry closed',
          text: `You have closed entry the entry on ${closed[0].workstation.name}`,
        });
        // eslint-disable-next-line no-empty
      } catch (e) {}
      this.closeCancel();
    },
    observationsClose() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedIndex = -1;
        this.editedItem = {
          active: 1,
          observations: '',
        };
      });
    },
    async observationsSave() {},
  },
};
</script>

<style></style>
