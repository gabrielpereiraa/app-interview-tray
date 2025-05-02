import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Dashboard from '@/components/Dashboard.vue';
import Login from '@/components/Login.vue';
import UserList from '@/components/users/UserList.vue';
import UserForm from '@/components/users/UserForm.vue';
import UserDetail from '@/components/users/UserDetail.vue';
import SellerList from '@/components/sellers/SellerList.vue';
import SellerForm from '@/components/sellers/SellerForm.vue';
import SellerDetail from '@/components/sellers/SellerDetail.vue';
import SaleList from '@/components/sales/SaleList.vue';
import SaleForm from '@/components/sales/SaleForm.vue';
import SaleDetail from '@/components/sales/SaleDetail.vue';
import { useAuthStore } from '@/stores/auth';
import { authMiddleware } from '@/middleware/auth';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: (to, from) => {
      const authStore = useAuthStore()
      if(authStore.isAuthenticated){
        return { name: "Dashboard"}
      }
    }
  },
  {
    path: '/users',
    name: 'UserList',
    component: UserList,
  },
  {
    path: '/users/create',
    name: 'UserCreate',
    component: UserForm,
  },
  {
    path: '/users/:id',
    name: 'UserDetail',
    component: UserDetail,
    props: true
  },
  {
    path: '/users/:id/edit',
    name: 'UserForm',
    component: UserForm,
    props: true
  },
  {
    path: '/sellers',
    name: 'SellerList',
    component: SellerList,
  },
  {
    path: '/sellers/create',
    name: 'SellerCreate',
    component: SellerForm,
  },
  {
    path: '/sellers/:id',
    name: 'SellerDetail',
    component: SellerDetail,
    props: true
  },
  {
    path: '/sellers/:id/edit',
    name: 'SellerEdit',
    component: SellerForm,
    props: true
  },
  {
    path: '/sales',
    name: 'SaleList',
    component: SaleList,
  },
  {
    path: '/sales/create',
    name: 'SaleCreate',
    component: SaleForm,
  },
  {
    path: '/sales/:id',
    name: 'SaleDetail',
    component: SaleDetail,
    props: true
  },
  {
    path: '/sales/:id/edit',
    name: 'SaleEdit',
    component: SaleForm,
    props: true
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if(to.name != 'Login') {
    authMiddleware(to, from, next);
  }else {
    next();
  }
});

export default router;