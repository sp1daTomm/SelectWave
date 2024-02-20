<template>
  <button type="button" class="fixed grid w-12 h-12 p-3 rounded-full place-content-center bg-primary right-6 bottom-28 md:right-32 md:bottom-40 hover:bg-primary-dark" @click="scrollToTop">
    <i class="text-white bi bi-chevron-up" />
</button>
</template>
<script setup>

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>
