<template>
    <div class="container">
     <div class="row justify-content-center">
      <div class="col-md-8" v-if="hasPermission">
        <div v-if="!hasPermission" class="alert alert-warning">
          Você não tem permissão.
          <span id="countdown">2</span> seconds.
        </div>
        <div v-else class="card mt-5">
          <div class="card-header">{{ isEditMode ? 'Editar Vendedor(a)' : 'Criar Vendedor(a)' }}</div>
          <div class="card-body">
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="name" class="form-label">Nome</label>
                <input type="text" class="form-control" id="name" v-model="form.name" required>
                <div v-if="errors.name" class="text-danger">{{ errors.name }}</div>
              </div>
              <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                <span v-if="isSubmitting" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                {{ isEditMode ? 'Alterar' : 'Criar' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue';
import { useRouter, useRoute} from 'vue-router';
import { sellersService } from '@/services/sellers';
import { Seller, defaultSeller } from '@/models/seller';
import { can } from '@/utils/permissions';
import { useAuthStore } from '@/stores/auth';
import { useNotificationStore } from '@/stores/notification';
 
const router = useRouter();
const route = useRoute();
const isSubmitting = ref(false);
const errors = reactive<{ name?: string; email?: string; created_by?: string }>({});
const sellerId = computed(() => Number(route.params.id));

const isEditMode = computed(() => !!sellerId.value);

const form = reactive<Seller>({
  ...defaultSeller,
});
const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const hasPermission = ref<boolean>(false);
if (!can('create', authStore.user.role) && !can('update', authStore.user.role)) {
  router.push("/");
}

onMounted(async () => {
  if(!hasPermission){
    return
  }
  if (isEditMode.value) {
    try {
      const response = await sellersService.getSellerById(sellerId.value);
      form.id = response.id;
      form.name = response.name;
      form.email = response.email;
      form.created_by = response.created_by;
    } catch (error) {
      console.error('Error fetching seller:', error);
      router.push('/sellers');
    }
  }
});

const handleSubmit = async () => {
  isSubmitting.value = true;
  errors.name = undefined;
  errors.email = undefined;
  errors.created_by = undefined;

  try {
    if (isEditMode.value) {
      await sellersService.updateSeller(sellerId.value, form);
    } else {
      await sellersService.createSeller(form);
    }
    router.push('/sellers');
    notificationStore.showNotification('Operation successfully completed!', 'success');
  } catch (error: any) {
    notificationStore.showNotification('An error occurred during the operation!', 'error');

    if (error.response && error.response.status === 422) {
      const validationErrors = error.response.data.errors;      
            Object.keys(validationErrors).forEach((key) => {
        errors[key as keyof typeof errors] = validationErrors[key][0];
      });
    } else {
      console.error('An unexpected error occurred:', error);
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>