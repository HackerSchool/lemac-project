<template>
  <div>
    <v-container v-if="workstations" class="mt-6">
      <WorkstationsTable :passedData="workstations" />
    </v-container>
  </div>
</template>

<script>
import WorkstationsTable from '@/components/Workstations/WorkstationsTable.vue';
import { getWorkstations } from '@/api/workstations.api';

export default {
  name: 'WorkstationsPage',
  components: { WorkstationsTable },
  data() {
    return {
      workstations: null,
    };
  },
  async mounted() {
    this.$loading.show();
    const response = await getWorkstations();
    this.workstations = response.data;
    this.$loading.hide();
  },
};
</script>
