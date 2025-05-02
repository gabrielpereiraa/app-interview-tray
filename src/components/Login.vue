<template>
  <div class="container">
    <div class="row justify-content-center align-items-center" style="min-height: 100vh;">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow-lg border-0 rounded-4">
          <div class="card-header text-center bg-primary text-white">
            <h3 class="m-0">Entrar</h3>
          </div>
          <div class="card-body p-4">
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="email" class="form-label">E-mail</label>
                <input type="email" class="form-control" id="email" v-model="email" placeholder="Digite seu e-mail" required />
                <div v-if="errors.email" class="text-danger mt-1">{{ errors.email }}</div>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Senha</label>
                <input type="password" class="form-control" id="password" v-model="password" placeholder="Digite sua senha" required />
                <div v-if="errors.password" class="text-danger mt-1">{{ errors.password }}</div>
              </div>
              <button type="submit" class="btn btn-primary w-100" :disabled="isSubmitting">
                <span v-if="isSubmitting" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Entrar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { authService } from '@/services/auth';

const router = useRouter();
const authStore = useAuthStore();

const email = ref<string>('');
const password = ref<string>('');
const isSubmitting = ref(false);
const errors = reactive<{ email?: string; password?: string }>({});

onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/');
  }
});

const handleLogin = async () => {
  isSubmitting.value = true;
  resetErrors();

  try {
    const response = await authService.login(email.value, password.value);

    console.log(response)

    if (response.token) {
      await authStore.login(`${response.token.token_type} ${response.token.access_token}`);
      authStore.setUser(response.user);
      router.push('/');
    } else {
      throw new Error('Token not found');
    }
  } catch (error: any) {
    console.log(error);
    handleError(error);
  } finally {
    isSubmitting.value = false;
  }
};

const resetErrors = () => {
  errors.email = undefined;
  errors.password = undefined;
};

const handleError = (error: any) => {
  errors.email = 'Credenciais inválidas.';
};
</script>
