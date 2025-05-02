<template>
  <div class="container mt-5">
    <div v-if="!canView" class="alert alert-danger" role="alert">
      Voce não tem permissão para acessar.
    </div>
    <div v-else-if="isLoading" class="d-flex justify-content-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>
    <div v-if="canView">
      <div class="mb-4">
        <h1>Detalhes da venda</h1>
        <p><strong>Nome:</strong> {{ seller.name }}</p>
        <p><strong>Email:</strong> {{ seller.email }}</p>
        <p><strong>Criado por:</strong> {{ seller.created_by }}</p>
      </div>

      <div class="row mb-4">
        <div class="col-md-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Total de Vendas</h5>
              <p class="card-text">
                {{ $formatCurrency(totalSalesAmount) }}
              </p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Número de vendas</h5>
              <p class="card-text">{{ sales.length }}</p>
            </div>
          </div>
        </div>
      </div>

      <h2>Vendas</h2>
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Valor</th>
            <th>Comissão</th>
            <th>Venda em</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sale in sales" :key="sale.id">
            <td>{{ sale.id }}</td>
            <td>{{ $formatCurrency(sale.amount) }}</td>
            <td>{{ $formatCurrency(sale.commission) }}</td>
            <td>{{ $formatDate(sale.made_at) }}</td>
          </tr>
          <tr v-if="sales.length === 0">
            <td colspan="4" class="text-center">Nenhuma venda encontrada.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; // Import useRouter
import { sellersService } from '@/services/sellers';
import type { Seller } from '@/models/seller';
import type { Sale } from '@/models/sale';
import { can } from '@/utils/permissions';

const route = useRoute();
const authStore = useAuthStore();
const router = useRouter();
const sellerId = Number(route.params.id);

const isLoading = ref(false);
const error = ref<string | null>(null);
const seller = ref<Seller>({} as Seller);
const sales = ref<Sale[]>([]);

const totalSalesAmount = computed<number>(() => {
  return sales.value.reduce((sum, sale) => sum + parseFloat((sale.amount || 0)), 0);
});

const canView = computed(() => can('view', authStore.user.role));

onMounted(async () => {
  isLoading.value = true;
  try {
    if (!canView.value) {
      setTimeout(() => {
        router.push("/");
      }, 2000);
      return;
    }
    
      const [sellerResponse, salesResponse] = await Promise.all([
      sellersService.getSellerById(sellerId),
      sellersService.getSellerSales(sellerId),
    ]);
    seller.value = sellerResponse;
    sales.value = salesResponse;
  } catch (err: any) {
    error.value = err.message || 'Ocorreu um erro.';
  } finally {
    isLoading.value = false;
  }
});
</script>