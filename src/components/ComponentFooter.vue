<template>
  <footer class="p-3 md:p-10 max-w-screen-lg mx-auto">
    <div class="bg-gray-4 pb-4 pt-6 mx-auto rounded-t-2xl">
      <img class="mx-auto w-12 mb-3 md:w-16" :src="logoImageUrl" alt="選集">
      <ul class="flex justify-center">
        <li><RouterLink to="/terms" class="px-2 py-1 transition hover:text-primary" type="button">關於我們</RouterLink></li>
        <li><RouterLink to="/" class="px-2 py-1 transition hover:text-primary" type="button">開始投票</RouterLink></li>
        <li><button class="px-2 py-1 transition hover:text-primary" type="button">常見問題</button></li>
        <li><button class="px-2 py-1 transition hover:text-primary" type="button">聯絡我們</button></li>
      </ul>
    </div>
    <div class="rounded-b-2xl my-1 bg-gray-4 text-center py-3">
      <p class="text-gray-2">本網站不提供商業用途。</p>
    </div>
  </footer>
</template>
<script setup>
const logoImageUrl = '/img_components/logo.svg';
</script>
