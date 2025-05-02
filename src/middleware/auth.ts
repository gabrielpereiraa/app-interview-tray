import { useAuthStore } from '@/stores/auth';

import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

export async function  authMiddleware(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  if (useAuthStore().isAuthenticated) {
    next();
  } else {
    next('/login');
  }
}