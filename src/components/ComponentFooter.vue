<template>
  <footer class="max-w-screen-xl p-3 mx-auto md:p-10">
    <div class="pt-6 pb-4 mx-auto bg-gray-4 rounded-t-2xl">
      <img class="w-12 mx-auto mb-3 md:w-16" :src="logoImageUrl" alt="選集">
      <ul class="flex justify-center">
        <li><RouterLink to="/none" class="px-2 py-1 transition hover:text-primary" type="button">開始投票</RouterLink></li>
        <li><RouterLink to="/faq" class="px-2 py-1 transition hover:text-primary" type="button">常見問題</RouterLink></li>
        <li><RouterLink to="/terms" class="px-2 py-1 transition hover:text-primary" type="button">關於我們</RouterLink></li>
        <li><button class="px-2 py-1 transition hover:text-primary" type="button" @click="showModal">聯絡我們</button></li>
      </ul>
    </div>
    <div class="py-3 my-1 text-center rounded-b-2xl bg-gray-4">
      <p class="text-gray-2">本網站不提供商業用途。</p>
    </div>
  </footer>
  <ContactFormModal :isShowModal="isShowModal" :closeModal="closeModal" />
</template>
<script setup>
import { ref } from 'vue';
import ContactFormModal from '@/components/ContactFormModal.vue';

const logoImageUrl = '/img_components/logo.svg';
const isShowModal = ref(false);
const showModal = () => {
  isShowModal.value = true;
};
const closeModal = () => {
  isShowModal.value = false;
};
</script>
