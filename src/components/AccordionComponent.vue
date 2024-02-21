<script setup>
import { onMounted, ref } from 'vue';

const accordionOpen = ref(false);

const props = defineProps({
  title: String,
  id: Number,
  active: Boolean,
});

onMounted(() => {
  accordionOpen.value = props.active;
});
</script>

<template>
  <div class="py-2">
    <h2>
      <button
        :id="`accordion-title-${id}`"
        class="flex items-center justify-between w-full py-2 font-semibold text-left text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400"
        @click.prevent="accordionOpen = !accordionOpen"
        :aria-expanded="accordionOpen"
        :aria-controls="`accordion-text-${id}`"
      >
        <span>{{ title }}</span>
        <div class="transition duration-200 ease-out origin-center transform" :class="{ '!rotate-180': accordionOpen }">
          <i class="bi bi-chevron-down" />
        </div>
      </button>
    </h2>
    <div
      :id="`accordion-text-${id}`"
      role="region"
      :aria-labelledby="`accordion-title-${id}`"
      class="grid overflow-hidden text-sm transition-all duration-300 ease-in-out text-slate-600"
      :class="accordionOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
    >
      <div class="overflow-hidden">
        <p class="pb-3">
          <slot />
        </p>
      </div>
    </div>
  </div>
</template>
