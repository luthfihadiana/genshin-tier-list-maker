<template>
  <nav class="w-full h-[60px] p-2 bg-black flex items-center justify-between">
    <router-link :to="{name: 'Home'}">
      <h1 class="text-xl">
        <span class="font-title">Genshin</span>
        Tierlist Maker
      </h1>
    </router-link>
  </nav>
  <main class="flex-grow w-full px-4 py-4 overflow-y-auto md:px-12 md:py-8">
    <RouterView/>
  </main>
  <footer class="w-full h-[60px] p-2 bg-black flex items-center justify-center">
    By @luthfihadiana
  </footer>
  <div id="snackbar" class="fixed bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm px-4 py-3 rounded shadow-lg opacity-0 transition-opacity duration-300">
    <p id="snackbar-message"></p>
  </div>
</template>
