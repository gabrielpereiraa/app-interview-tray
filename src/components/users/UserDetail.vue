<template>
  <div class="container mt-5">
    <div v-if="loading" class="d-flex justify-content-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-if="!canAccess" class="d-flex justify-content-center mt-5">
      <span>Você não tem permissão para acessar...</span>
    </div>

    <div v-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>
    <div v-else-if="user" class="card">
      <div class="card-header">
        <h2>User Detail</h2>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <strong>ID:</strong> {{ user.id }}
        </div>
        <div class="mb-3">
          <strong>Name:</strong> {{ user.name }}
        </div>
        <div class="mb-3">
          <strong>Email:</strong> {{ user.email }}
        </div>
        <ul class="nav nav-tabs">
          <li class="nav-item">
            <a class="nav-link" :class="{ active: activeTab === 'sellers' }" href="#" @click.prevent="activeTab = 'sellers'">
              Sellers
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" :class="{ active: activeTab === 'sales' }" href="#" @click.prevent="activeTab = 'sales'">
              Sales
            </a>
          </li>
        </ul>

        <div v-if="activeTab === 'sellers'" class="mt-3">
          <div v-if="sellersLoading" class="d-flex justify-content-center">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          <div v-else-if="sellersError" class="alert alert-danger" role="alert">
            {{ sellersError }}
          </div>
          <ul v-else class="list-group">
            <li v-for="seller in userSellers" :key="seller.id" class="list-group-item">
              {{ seller.name }} - {{ seller.email }}
            </li>
          </ul>
        </div>

        <div v-else-if="activeTab === 'sales'" class="mt-3">
          <div v-if="salesLoading" class="d-flex justify-content-center">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          <div v-else-if="salesError" class="alert alert-danger" role="alert">
            {{ salesError }}
          </div>
          <ul v-else class="list-group">
            <li v-for="sale in userSales" :key="sale.id" class="list-group-item">
              {{ $formatCurrency(sale.amount) }} - {{ $formatCurrency(sale.commission) }} - {{ $formatDate(sale.made_at) }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usersService } from '@/services/users';
import type { User } from '@/models/user';
import type { Seller } from '@/models/seller';
import type { Sale } from '@/models/sale';
import { useAuthStore } from '@/stores/auth';
import { can } from '@/utils/permissions';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const userId = Number(route.params.userId);

const user = ref<User | null>(null);
const loading = ref<boolean>(false);
const userSellers = ref<Seller[]>([]);
const userSales = ref<Sale[]>([]);
const error = ref<string | null>(null);
const sellersLoading = ref<boolean>(false);
const sellersError = ref<string | null>(null);
const salesLoading = ref<boolean>(false);
const salesError = ref<string | null>(null);
const activeTab = ref<string>('sellers');
const canAccess = ref<boolean>(can('view', authStore.user.role));

// Redireciona após 2 segundos se não tiver permissão
if (!canAccess.value) {
  setTimeout(() => {
    router.push('/');
  }, 2000);
}

onMounted(async () => {
  loading.value = true;
  try {
    user.value = await usersService.getUserById(userId);
  } catch (err: any) {
    error.value = err.message || 'Failed to load user details';
  } finally {
    loading.value = false;
  }

  if (canAccess.value) {
    await loadRelatedData();
  }
});

const loadRelatedData = async () => {
  if (!user.value) return;

  sellersLoading.value = true;
  try {
    const sellers = await usersService.getUserSellers(userId);
    userSellers.value = Array.isArray(sellers) ? sellers : [];
  } catch (err: any) {
    sellersError.value = err.message || 'Erro ao carregar os vendedores.';
  } finally {
    sellersLoading.value = false;
  }

  salesLoading.value = true;
  try {
    const sales = await usersService.getUserSales(userId);
    userSales.value = Array.isArray(sales) ? sales : [];
  } catch (err: any) {
    salesError.value = err.message || 'Erro ao carregar as vendas.';
  } finally {
    salesLoading.value = false;
  }
};
</script>
