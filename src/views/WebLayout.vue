<template>
  <Navbar />
  <RouterView />
  <TopGo />
  <ComponentFooter />
</template>
<script setup>
import ComponentFooter from '@/components/ComponentFooter.vue';
import Navbar from '@/components/NavbarEl.vue';
import TopGo from '@/components/TopGoEl.vue';
</script>
