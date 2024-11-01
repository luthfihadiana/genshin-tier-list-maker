<script lang="ts" setup>
import { useRouter } from "vue-router";
const router = useRouter();

function goHome() {
  router.push({ name: "Home" });
}
</script>
<template>
  <div class="flex flex-col items-center justify-center h-screen text-center">
    <h1 class="text-4xl font-bold text-white mb-4">Page Not Found</h1>
    <p class="text-gray-400 mb-6">Sorry, the page you are looking for does not exist.</p>
    <button
      @click="goHome"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Go to Home
    </button>
  </div>
</template>