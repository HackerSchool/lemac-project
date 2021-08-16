<template>
  <div>
    <v-progress-linear v-if="loading" indeterminate />
    <v-container class="mt-6">
      <UsersTable v-if="!loading" :members="users" />
    </v-container>
  </div>
</template>

<script>
import UsersTable from '@/components/Users/UserTable';
import { getUsers } from '@/api/user.api';

export default {
  name: 'UserPage',
  components: { UsersTable },
  data() {
    return {
      users: [],
      loading: false,
    };
  },
  async mounted() {
    this.loading = true;
    const response = await getUsers();
    this.users = response.data;
    this.loading = false;
  },
};
</script>
