<template>
  <button type="button" class="bg-primary rounded-full inline-block p-3 fixed right-6 bottom-28
  md:right-32 md:bottom-40 hover:bg-primary-dark" @click="scrollToTop">
    <ChevronUp class="text-white" />
</button>
</template>
<script setup>
import { ChevronUp } from 'lucide-vue-next';

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>
