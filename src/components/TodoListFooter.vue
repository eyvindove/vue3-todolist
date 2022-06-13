<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const year: number = new Date().getFullYear()
</script>

<template>
  <div class="flex flex-col items-center mt-4">
    <router-link v-if="route.name === 'todoList'" class="btn-primary" :to="{ name: 'about' }">
      About TodoList
    </router-link>
    <router-link
      v-if="route.name === 'about'"
      class="btn-primary"
      :to="{ name: 'todoList' }"
    >
      TodoList
    </router-link>

    <p class="mt-2 text-sm text-zinc-500">
      Copyright &copy; {{ year }} eyvindove reserved.
    </p>
  </div>
</template>
