<template>
  <div class="container" v-if="!isLoading">
    <div class="row">
      <div class="col-12" v-if="hasPermission">
        <div class="card mt-3">
          <div class="card-header">Sale Detail</div>
          <div class="card-body">
            <div class="row">
              <div class="text-center">
                <p class="text-danger" v-if="!hasPermission">Voce não tem permissão para acessar.</p>
              </div>
              <div class="col-md-6">
                <p><strong>ID:</strong> {{ sale.id }}</p>                
                <p><strong>Amount:</strong> {{ $formatCurrency(sale.amount) }} </p>
                <p><strong>Commission:</strong> {{ $formatCurrency(sale.commission) }}</p>
                <p><strong>Date:</strong> {{ $formatDate(sale.made_at) }}</p>
                <p><strong>Seller ID:</strong> {{ sale.seller_id }}</p>
                <p><strong>User ID:</strong> {{ sale.user_id }}</p>
                <button class="btn btn-secondary" @click="$router.back()">voltar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="!hasPermission">
     <div class="text-center">Você não tem permissão para acessar...</div>
  </div>
  <div v-else>
    Loading...
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { salesService } from '@/services/sales';
import type { Sale } from '@/models/sale';
import { useAuthStore } from '@/stores/auth';
import { can } from '@/utils/permissions';
import { useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter()
const saleId = Number(route.params.id);
const sale = ref<Sale>({} as Sale);
const isLoading = ref(true);
const authStore = useAuthStore()

const hasPermission = ref<boolean>(can('view', authStore.user.role));


onMounted(async () => {
  if(!hasPermission.value) {
    setTimeout(() => router.push("/"), 2000)
  }else{
      try {
        sale.value = await salesService.getSaleById(saleId);
      } catch (error) {
        console.error('Failed to load sale details', error);
      } finally {
        isLoading.value = false;
      }
  }
});
</script>