<template>
  <div class="elevation-1">
    <v-toolbar flat>
      <v-toolbar-title> Lab Entries </v-toolbar-title>
      <v-divider class="mx-4" inset vertical></v-divider>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialogAdd" max-width="550px">
        <template #activator="{ on, attrs }">
          <v-btn color="secondary" dark class="mb-2" v-bind="attrs" v-on="on">
            New Registration
          </v-btn>
        </template>
        <v-card>
          <v-form ref="formAdd" lazy-validation @submit.prevent="save">
            <v-card-title>
              <span class="headline"> New Registration </span>
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    v-model="newItem.istId"
                    :rules="[(v) => !!v || 'IST Id is required']"
                    label="Id"
                    type="number"
                    required
                    filled
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-select
                    v-model="newItem.workstationId"
                    label="Workstation"
                    :items="workstations"
                    item-text="name"
                    item-value="id"
                    :rules="[(v) => !!v || 'Workstation is required']"
                    required
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
    </v-toolbar>
    <v-list>
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
          <v-form ref="formEdit" lazy-validation @submit.prevent="save">
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
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
  </div>
</template>

<script>
import { getEntries, updateEntry, addEntry } from '@/api/entries.api';
import { getWorkstations } from '@/api/workstations.api';
export default {
  data() {
    return {
      entries: [],
      workstations: [],
      editedItem: {
        active: 1,
        observations: '',
      },
      newItem: {
        istId: '',
        workstationId: '',
      },
      dialog: false,
      dialogAdd: false,
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
  watch: {
    async dialogAdd(val) {
      if (val) await this.loadWorkstations();
      else this.close();
    },
    dialog(val) {
      val || this.observationsClose();
    },
    dialogClose(val) {
      val || this.closeCancel();
    },
  },
  async mounted() {
    this.$loading.show();
    const { data } = await getEntries(1);
    this.entries = data;
    this.$loading.hide();
  },
  methods: {
    // trigger methods
    addObservation(item) {
      this.editedIndex = this.entries.indexOf(item);
      this.editedItem.observations = item.observations;
      this.dialog = true;
    },
    closeEntry(item) {
      this.editedIndex = this.entries.indexOf(item);
      this.dialogClose = true;
    },
    // dont touch this cancer again
    async loadWorkstations() {
      this.$loading.show();
      const { data } = await getWorkstations();

      const available = data.filter((x) => x.occupation == 0 && x.occupation != x.capacity);
      const partlyAvailable = data.filter((x) => x.occupation > 0 && x.occupation < x.capacity);
      const notAvailable = data.filter((x) => x.type === 'disabled' || x.occupation === x.capacity);

      const workstationsSorted = [{ header: 'Available' }];
      available.forEach((x) => workstationsSorted.push(x));
      workstationsSorted.push({ header: 'Partly Available' });
      partlyAvailable.forEach((x) => workstationsSorted.push(x));
      workstationsSorted.push({ header: 'Not Available' });
      notAvailable.forEach((x) => workstationsSorted.push({ ...x, disabled: 'true' }));

      this.workstations = workstationsSorted;
      this.$loading.hide();
    },
    // close entry methods
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
      } finally {
        this.closeCancel();
      }
    },
    // observations methods
    observationsClose() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedIndex = -1;
        this.editedItem.observations = '';
      });
    },
    async observationsSave() {
      try {
        const { data } = await updateEntry(this.entries[this.editedIndex].id, this.editedItem);
        this.entries.splice(this.editedIndex, 1, data);
        this.$notify({
          type: 'success',
          title: 'Entry updated',
          text: `You have updated an entry for workstation ${data.workstation.name}`,
        });
      } finally {
        this.observationsClose();
      }
    },
    // add entry methods
    close() {
      this.dialogAdd = false;
      this.$refs.formAdd.resetValidation();
      this.$nextTick(() => {
        this.newItem = {
          istId: '',
          workstationId: '',
        };
      });
    },
    async save() {
      if (!this.$refs.formAdd.validate()) return;
      try {
        const { data } = await addEntry({
          istId: 'ist1' + this.newItem.istId,
          workstationId: this.newItem.workstationId,
        });
        this.entries.push(data);
        this.$notify({
          type: 'success',
          title: 'Entry created',
          text: `You have created an entry for workstation ${data.workstation.name}`,
        });
      } finally {
        this.close();
      }
    },
  },
};
</script>

<style></style>
