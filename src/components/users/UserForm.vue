<template>
  <div class="container">
    <div class="row justify-content-center">
      <div v-if="!hasPermission" class="text-center">
        <div class="alert alert-warning">
          You do not have permission to access this page. Redirecting in 2 seconds...
        </div>
      </div>
      <div class="col-md-8">
        <div class="card mt-5" v-if="hasPermission">
          <div class="card-header">{{ isEditMode ? "Edit User" : "Create User" }}</div>
          <div class="card-body">
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <input type="text" class="form-control" id="name" v-model="formData.name" required>
                <div v-if="errors.name" class="text-danger">{{ errors.name }}</div>
              </div>
              <div class="mb-3" v-if="!isEditMode">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email" v-model="formData.email" required>
                <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
              </div>
              <div class="mb-3" v-if="!isEditMode">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" v-model="formData.password" required>
                <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
              </div>
              <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                <span v-if="isSubmitting" class="spinner-border spinner-border-sm" role="status"
                  aria-hidden="true"></span>
                {{ isEditMode ? 'Update' : 'Create' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { useNotificationStore } from '@/stores/notification';
import { useUsersStore } from '@/stores/users';
import { User, defaultUser } from '@/models/user';
import { useAuthStore } from '@/stores/auth';
import { can } from '@/utils/permissions';

const router = useRouter();
const route = useRoute();

const usersStore = useUsersStore();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const hasPermission = ref<boolean>(false);
if (!can('create', authStore.user.role) && !can('update', authStore.user.role)) {
  router.push("/");
}

const isEditMode = ref<boolean>(false);
const isSubmitting = ref<boolean>(false);
const formData = reactive<Partial<User>>({ ...defaultUser });
const errors = reactive<{ name?: string; password?: string }>({});

const handleSubmit = async () => {
  isSubmitting.value = true;
  clearErrors();

  try {
    if (isEditMode.value) {
      await usersStore.updateUser(Number(route.params.id), formData as User);
      notificationStore.showNotification('User updated successfully', 'success');
    } else {
      const user = await usersStore.createUser(formData as User);
      notificationStore.showNotification('User created successfully', 'success');
    }
    setTimeout(() => {
      router.push('/users');
    }, 2000);
  } catch (error: any) {
    notificationStore.showNotification('An error occurred while updating the user', 'error');
    if (error.response && error.response.status === 422) {
      const validationErrors = error.response.data.errors;
      Object.keys(validationErrors).forEach((key) => {
        errors[key as keyof typeof errors] = validationErrors[key][0];
      });
    }
    setTimeout(() => {
      router.push('/users');
    }, 2000);
  } finally {
    isSubmitting.value = false;
  }
};

const clearErrors = () => {
  errors.name = undefined;
  errors.password = undefined;
};

onMounted(async () => {
  if (can('create', authStore.user.role) || can('update', authStore.user.role)) {
    hasPermission.value = true;
  }
  if (route.params.userId) {
    isEditMode.value = true;
    const user = await usersStore.getUserById(Number(route.params.userId));
    if (user) {
      formData.name = user.name;
    }
  }
});
</script>