<template>
  <div class="table-responsive">
    <table class="table table-striped table-hover" v-if="!loading">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key" scope="col">{{ col.label }}</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td v-for="col in columns" :key="col.key">{{ item[col.key] }}</td>
          <td>
            <div class="btn-group">
              <router-link
                v-if="viewRouteName"
                :to="{ name: viewRouteName, params: { id: item.id } }"
                class="btn btn-sm btn-info">
                <i class="fas fa-eye"></i>
              </router-link>
              <router-link
                v-if="editRouteName"
                :to="{ name: editRouteName, params: { id: item.id } }"
                class="btn btn-sm btn-warning ms-1">
                <i class="fas fa-pencil"></i>
              </router-link>
              <DeleteButton :item-id="item.id" :delete-function="deleteFunction" class="ms-1" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="d-flex justify-content-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import DeleteButton from './DeleteButton.vue';

defineProps({
  items: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  viewRouteName: {
    type: String,
    default: null,
  },
  editRouteName: {
    type: String,
    default: null,
  },
  deleteFunction: {
    type: Function,
    required: true,
  },
});
</script>