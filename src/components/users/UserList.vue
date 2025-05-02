<template>
  <div class="container">
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Usuários</h2>
        <router-link v-if="can('create', authStore.user.role)" to="/users/create" class="btn btn-primary">
          Adicionar usuário
        </router-link>
    </div>
    <TableList
      v-if="can('view', authStore.user.role)"
      :items="users"
      :columns="columns"
      :loading="isLoading"
      view-route-name="UserDetail"
      :delete-function="usersStore.deleteUser" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useUsersStore } from '@/stores/users';
import { useNotificationStore } from '@/stores/notification';
import { can } from '@/utils/permissions';
import TableList from '@/components/common/TableList.vue';
import type { Column } from '@/components/common/TableList.vue';

const authStore = useAuthStore();
const usersStore = useUsersStore();
const notificationStore = useNotificationStore();
const isLoading = ref(false);
const users = ref(usersStore.users);

watch(() => usersStore.users, (newUsers) => {
  users.value = newUsers
})

const columns = computed(() => [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nome' },
  { key: 'email', label: 'Email' },
]);

const fetchUsers = async () => {
  isLoading.value = true;
  await usersStore.getUsers();
  isLoading.value = false;
}

onMounted(async () => {
  await fetchUsers();
});

</script>