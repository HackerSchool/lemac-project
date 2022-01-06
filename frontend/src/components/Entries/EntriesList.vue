<template>
  <v-list class="elevation-1">
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
                <v-btn class="ma-1 info darken-1" small v-bind="attrs" v-on="on">
                  <v-icon>mdi-text</v-icon>
                </v-btn>
              </template>
              Observations
            </v-tooltip>
            <v-tooltip bottom open-delay="500">
              <template #activator="{ on, attrs }">
                <v-btn class="ma-1 error" small v-bind="attrs" v-on="on">
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
  </v-list>
</template>

<script>
import { getEntries } from '@/api/entries.api';
export default {
  data() {
    return {
      entries: [],
    };
  },
  async mounted() {
    this.$loading.show();
    const { data } = await getEntries(1);
    this.entries = data;
    this.$loading.hide();
  },
};
</script>

<style></style>
