<template>
  <div class="container">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2>Sellers</h2>
      <router-link to="/sellers/create" v-if="can('create', authStore.user.role)" class="btn btn-primary">Novo vendedor</router-link>
    </div>
    <TableList
      :items="sellers"
      :columns="columns"
      :loading="isLoading"
      viewRouteName="SellerDetail"
      editRouteName="SellerEdit"
      :deleteFunction="sellersStore.deleteSeller"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, } from 'vue';
import { useSellersStore } from '@/stores/sellers';
import { storeToRefs } from 'pinia';
import TableList from '@/components/common/TableList.vue';
const sellersStore = useSellersStore();
const { sellers } = storeToRefs(sellersStore);
const isLoading = ref(false);
import { useAuthStore } from '@/stores/auth';
import { can } from '@/utils/permissions';
import { useNotificationStore } from '@/stores/notification';

const columns = computed(() => [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'created_by', label: 'Created By' },
]);

const authStore = useAuthStore()
const notificationStore = useNotificationStore()

onMounted(async () => {  
  isLoading.value = true;
  try {
    await sellersStore.getSellers()
    .catch((error) => {
      notificationStore.showNotification('Error when trying to get the sellers', 'error');
      console.error(error);
    })
  } finally {
    isLoading.value = false;
  }
});

</script>