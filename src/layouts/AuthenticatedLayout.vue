<template>
  <div class="d-flex">
    <Notification v-if="notificationStore.message" :message="notificationStore.message" :type="notificationStore.type" :key="notificationKey" />
    
    <aside class="sidebar bg-primary p-3">
      <nav aria-label="Main navigation">
        <ul class="nav flex-column">
          <li class="nav-item">
            <router-link to="/" class="nav-link text-white" :class="{'active': isActive('/')}">
              <i class="fas fa-tachometer-alt"></i> Dashboard
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/users" class="nav-link text-white" :class="{'active': isActive('/users')}">
              <i class="fas fa-users"></i> Usuários
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/sellers" class="nav-link text-white" :class="{'active': isActive('/sellers')}">
              <i class="fas fa-store"></i> Vendedores
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/sales" class="nav-link text-white" :class="{'active': isActive('/sales')}">
              <i class="fas fa-shopping-cart"></i> Sales
            </router-link>
          </li>
          <button class="btn btn-outline-danger mt-4" @click="handleLogout">Logout</button>
        </ul>
      </nav>
    </aside>

    <main class="main-content p-4 flex-grow-1">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNotificationStore } from '@/stores/notification';
import Notification from '@/components/common/Notification.vue';
import { authService } from '@/services/auth';
import { useAuthStore } from '@/stores/auth';

const updateKey = () =>{
  return Math.random()
}

const notificationKey = computed(()=> updateKey())

const notificationStore = useNotificationStore();

watch(()=> notificationStore.message, (newValue) => {
  if(newValue){
    updateKey()
  }
})

const route = useRoute();
const router = useRouter();

const isActive = (path: string) => {
  console.log(useRoute().path)
  if (path == '/') {
    return useRoute().path == '/';
  } 
  return route.path.startsWith(path);
};

const handleLogout = async () => {
  try {
    await authService.logout();
    useAuthStore().logout();
    router.push('/login');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
</script>


<style scoped>
.d-flex {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 250px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #343a40;
  color: white;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.sidebar .nav-link {
  color: #c1c1c1;
  font-size: 16px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  transition: background-color 0.3s ease;
}

.sidebar .nav-link i {
  margin-right: 10px;
  font-size: 18px;
}

.sidebar .nav-link:hover,
.sidebar .nav-link.active {
  background-color: #495057;
  color: #fff;
}

.sidebar .nav-link.active {
  font-weight: bold;
}

.main-content {
  margin-left: 250px;
  padding: 20px;
  background-color: #f8f9fa;
  transition: margin-left 0.3s ease;
}

.top-bar {
  background-color: #007bff;
  color: white;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

@media (max-width: 992px) {
  .sidebar {
    width: 200px;
  }

  .main-content {
    margin-left: 200px;
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 0;
    display: none;
  }

  .main-content {
    margin-left: 0;
  }
}

.notification-enter-active, .notification-leave-active {
  transition: opacity 0.5s;
}
.notification-enter, .notification-leave-to {
  opacity: 0;
}

</style>