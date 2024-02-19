<script setup>
import {
  FwbAccordion,
  FwbAccordionContent,
  FwbAccordionHeader,
  FwbAccordionPanel,
} from 'flowbite-vue';
import faqData from '@/data/faq.json';

const { header, questions } = faqData;

</script>

<template>
  <main class="container max-w-screen-lg mx-auto">
    <div class="flex flex-col gap-12 py-16">
      <section class="flex flex-col md:flex-row-reverse md:items-center">
        <img src="/img_components/about-header-desktop.svg" alt="About us" class="hidden w-[55%] h-auto md:block md:-ml-48 md:-z-10" />
        <img src="/img_components/about-header-mobile.svg" alt="About us" class="w-full h-auto md:hidden" />
        <div class="flex flex-col gap-5 md:px-16 md:py-28">
          <h1 class="text-2xl font-bold">{{ header.title }}</h1>
          <div class="space-y-6">
            <p v-for="content in header.content" :key="content" class="md:text-lg">
              {{ content }}
            </p>
            <input type="button" value="聯絡我們" class="w-full px-6 py-3 text-white rounded-full bg-primary-dark" />
          </div>
        </div>
      </section>
      <fwb-accordion flush>
      <fwb-accordion-panel v-for="item in questions" :key="item">
        <fwb-accordion-header id="accordion-flush-heading-1">
            <span>{{ item.title }}</span>
        </fwb-accordion-header>
        <fwb-accordion-content>
          <p class="flex items-center gap-4 mb-2 text-gray-500 dark:text-gray-400" v-for="content in item.content" :key="content">
            <i class="w-5 h-5 bi bi-asterisk shrink-0 text-primary" />
            {{ content }}
          </p>
        </fwb-accordion-content>
      </fwb-accordion-panel>
      </fwb-accordion>
    </div>
  </main>
</template>
