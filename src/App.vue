<script setup lang="ts">
import AuthenticatedLayout from './layouts/AuthenticatedLayout.vue';
import { useAuthStore } from './stores/auth';

const authStore = useAuthStore()

</script>

<template>
  <AuthenticatedLayout v-if="authStore.isAuthenticated">
    <router-view />
  </AuthenticatedLayout>  
  <router-view v-else />
</template>

<style scoped></style>
