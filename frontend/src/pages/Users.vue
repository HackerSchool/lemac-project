<template>
  <div>
    <v-container v-if="users" class="mt-6">
      <UsersTable :members="users" />
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
      users: null,
    };
  },
  async mounted() {
    this.$loading.show();
    const response = await getUsers();
    this.users = response.data;
    this.$loading.hide();
  },
};
</script>
