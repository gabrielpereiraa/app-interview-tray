<template>
  <div class="container">
    <div class="row justify-content-center">
      <div v-if="!hasPermission" class="alert alert-warning mt-5">
        Você não tem permissão para acessar...
      </div>

      <div class="col-md-8" v-if="hasPermission">
        <div class="card mt-5">
          <div class="card-header">{{ isEditMode ? 'Editar venda' : 'Criar venda' }}</div>
          <div class="card-body">
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="amount" class="form-label">Valor</label>
                <input type="text" class="form-control" id="amount" v-model.number="amount" required>
                <div v-if="errors.amount" class="text-danger">{{ errors.amount }}</div>
              </div>

              <div class="mb-3">
                <label for="made_at" class="form-label">Data da venda</label>
                <input type="date" class="form-control" id="made_at" v-model="made_at" required>
                <div v-if="errors.made_at" class="text-danger">{{ errors.made_at }}</div>
              </div>

              <div class="mb-3">
                <label for="seller_id" class="form-label">Vendedor</label>
                <select id="seller_id" class="form-control" v-model="seller_id" required>
                  <option value="-1" disabled>Selecione um vendedor</option>
                  <option v-for="seller in sellers" :key="seller.id" :value="seller.id">
                    {{ seller.name }}
                  </option>
                </select>
                <div v-if="errors.seller_id" class="text-danger">{{ errors.seller_id }}</div>
              </div>

              <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                <span v-if="isSubmitting" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                {{ isEditMode ? 'Atualizar Venda' : 'Criar Venda' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { sellersService } from '@/services/sellers';
import { salesService } from '@/services/sales';
import { useAuthStore } from '@/stores/auth';

const notificationMessage = ref<string>('');
const notificationType = ref<'success' | 'error'>('success');

const router = useRouter();
const route = useRoute();

const saleId = ref<number | null>(Number(route.params.id) || null);

const isSubmitting = ref(false);

const amount = ref<number>(0);
const made_at = ref<string>('');
const seller_id = ref<number>(-1);
const sellers = ref<{ id: number; name: string }[]>([]);

const errors = reactive<{ [key: string]: string }>({});

const isEditMode = computed(() => saleId.value !== null);

const authStore = useAuthStore();

import { can } from '@/utils/permissions';
import { get } from 'http';
const hasPermission = computed(() => can('create', authStore.user.role) || can('update', authStore.user.role));

onMounted(async () => {
  try {
    const response = await sellersService.getSellers();
    sellers.value = response;
  } catch (e) {
    console.error('Erro ao buscar vendedores:', e);
  }

  if (isEditMode.value && saleId.value) {
    try {
      const response = await salesService.getSaleById(saleId.value);
      amount.value = response.amount;
      made_at.value = new Date(response.made_at);
      seller_id.value = response.seller_id;
    } catch (e) {
      console.error('Erro ao carregar venda:', e);
    }
  }
});

const handleSubmit = async () => {
  isSubmitting.value = true;
  Object.keys(errors).forEach(key => errors[key as keyof typeof errors] = '');

  try {
    if (isEditMode.value && seller_id.value) {
      await sellersService.updateSellerSale(seller_id.value, saleId.value, { amount: amount.value, made_at: made_at.value });
    } else if (seller_id.value) {
      await sellersService.createSellerSale(seller_id.value, { amount: amount.value, made_at: made_at.value, seller_id: seller_id.value });
    }

    router.push('/sales');
  } catch (error: any) {
    if (error.response && error.response.status === 422) {
      const validationErrors = error.response.data.errors;
      Object.keys(validationErrors).forEach((key) => {
        errors[key] = validationErrors[key][0];
      });
    }
  } finally {
    isSubmitting.value = false;
  }
};

if (!hasPermission.value) {
  setTimeout(() => {
    router.push('/');
  }, 2000);
}
</script>