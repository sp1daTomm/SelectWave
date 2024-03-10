<script setup>
import { defineProps, inject, watchEffect } from 'vue';

const props = defineProps({
  showAnimation: Boolean,
});

const appRef = inject('appRef');

watchEffect(() => {
  if (props.showAnimation) {
    appRef.value.style.height = '100dvh';
  } else {
    appRef.value.style.height = 'auto';
  }
});
</script>

<template>
  <transition>
    <div v-if="showAnimation" class="absolute inset-0 z-50 w-full h-full backdrop-blur-[2px] bg-gray-4/50">
      <div class="relative block w-full h-4 max-w-screen-md mx-auto overflow-hidden border rounded-full top-[50dvh] -translate-y-full bg-gray-1/75 border-gray-4 after:absolute after:left-0 after:top-0 after:h-full after:w-0 after:bg-primary loader" />
    </div>
  </transition>
</template>

<style scoped>
    .loader:after{
      animation: 6s prog ease-in infinite;
    }
    @keyframes prog {
        to  {   width: 100%;}
      }
</style>
