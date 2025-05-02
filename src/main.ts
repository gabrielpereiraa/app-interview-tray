import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { createPinia } from 'pinia';
import piniaPersist from 'pinia-plugin-persistedstate';
import router from './router/index';
import { formatCurrency, formatDate } from './utils/formatters';

const pinia = createPinia();
const app = createApp(App);
pinia.use(piniaPersist);

app.config.globalProperties.$formatCurrency = formatCurrency;
app.config.globalProperties.$formatDate = formatDate;

app.use(pinia)
app.use(router);
app.mount('#app');
