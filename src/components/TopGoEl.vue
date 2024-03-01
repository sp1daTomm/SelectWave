<template>
  <button type="button" class="fixed grid w-12 h-12 p-3 rounded-full place-content-center bg-primary right-6 bottom-28 md:right-32 md:bottom-40 hover:bg-primary-dark" @click="scrollToTop" v-show="isShow" :data-top-el="heightDom">
    <i class="text-white bi bi-chevron-up" />
</button>
</template>
<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

const screenHeight = window.innerHeight;
const heightDom = ref('');
let isShow = false;

const handleScroll = () => {
  const windowScrollY = window.scrollY * 2;
  if (windowScrollY > screenHeight) {
    isShow = true;
  } else {
    isShow = false;
  }
  heightDom.value = window.scrollY;
};
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

</script>
