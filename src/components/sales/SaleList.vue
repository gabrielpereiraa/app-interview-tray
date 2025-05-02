<template>
  <div class="container">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h1>Vendas</h1> 
      <router-link
          v-if="can('create', authStore.user.role) && authStore.isAuthenticated"
          to="/sales/create"
          class="btn btn-primary">
          Nova venda
        </router-link>
    </div>
    <TableList
      :items="sales"
      :columns="columns"
      :loading="isLoading"
      viewRouteName="SaleDetail"
      editRouteName="SaleEdit"
      :deleteFunction="salesStore.deleteSale"
    />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { onMounted, ref, computed, ComputedRef } from 'vue';
import { useSalesStore } from '@/stores/sales';
import TableList from '@/components/common/TableList.vue';
import { can } from '@/utils/permissions';
import { formatCurrency, formatDate } from '@/utils/formatters';

const salesStore = useSalesStore();
const authStore = useAuthStore();

const sales = computed(() => salesStore.sales);
const isLoading = ref<boolean>(false);

const columns = computed(() => [
  { key: 'id', label: 'ID' },
  { key: 'amount', label: 'Valor' },
  { key: 'commission', label: 'Comissão' },
  { key: 'seller_id', label: 'Vendedor(a)' },
  { key: 'user_id', label: 'Cadastrador por' },
  { key: 'made_at', label: 'Date' }
]);

const loadSales = async () => {
  isLoading.value = true;
  try {
    await salesStore.getSales();
    sales.value = salesStore.sales;

    sales.value.map((i) => {
      i['amount'] = formatCurrency(i['amount']);
      i['commission'] = formatCurrency(i['commission']);
      i['made_at'] = formatDate(i['made_at']);
      return 
    })

  } finally {
    isLoading.value = false;
  }
};

const handleDelete = async (saleId: number): Promise<void> => {
  isLoading.value = true;
  try {
    await salesStore.deleteSale(saleId);
  } finally {
    isLoading.value = false;
  }
};

onMounted(loadSales);
</script>
