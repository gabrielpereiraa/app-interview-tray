<template>
  <button class="btn btn-danger" @click="handleDelete"><i class="fas fa-trash"></i></button>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

interface Props {
  itemId: number;
  deleteFunction: (itemId: number) => void;
}

const props = defineProps<Props>();

const handleDelete = () => {
  if (confirm('Tem certeza que deseja deletar?')) {
    props.deleteFunction(props.itemId);
  }
};
</script>