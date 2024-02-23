<template>
  <RouterView />
</template>

<script setup>
import { useWebSocket } from '@/utils/ws';

useWebSocket();
</script>

<style lang="scss">

</style>
