<script setup lang="ts">
defineProps<{ title: string, onClick:()=>void }>()
</script>

<template>
  <div class="w-full cursor-pointer border-gray-400 rounded-md transition-transform hover:-translate-y-1 hover:scale-105" @click="onClick">
    <div class="h-[100px] w-full bg-gray-400 rounded-t-md relative">
      <p class="text-sm text-white absolute bg-gray-600 p-1 right-0 rounded-tr-md">
        2 Feb 2024
      </p>
    </div>
    <div class="w-full flex items-end px-1 py-2 bg-gray-600 rounded-b-md">
      <h3 class="text-sm font-title truncate ...">
        {{ title }}
      </h3>
    </div>
  </div>
</template>