<template>
  <div
    v-if="isVisible"
    class="alert"
    :class="{ 'alert-success': type === 'success', 'alert-danger': type === 'error' }"
    role="alert">
    {{ message }}
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  message: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    default: 'success',
    validator: (value: string) => ['success', 'error'].includes(value),
  },
});

const isVisible = ref(false);
let timeoutId: number | null = null;

const hideNotification = () => {
  isVisible.value = false;
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
};

const showNotification = () => {
  isVisible.value = true;
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  timeoutId = setTimeout(hideNotification, 3000) as unknown as number;
};

onMounted(() => {
  showNotification()
});

watch(() => props.message, () => {
  showNotification()
});
</script>