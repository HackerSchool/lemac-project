<template>
  <v-tabs grow>
    <v-tab key="1">Registration</v-tab>
    <v-tab key="2">Occurences</v-tab>
    <v-tab-item>
      <v-container>
        <EntriesList />
      </v-container>
    </v-tab-item>
    <v-tab-item>
      <v-container> </v-container>
    </v-tab-item>
  </v-tabs>
</template>

<script>
import EntriesList from '@/components/Entries/EntriesList.vue';
export default {
  components: { EntriesList },
};
</script>

<style></style>
