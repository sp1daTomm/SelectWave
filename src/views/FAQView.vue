<script setup>
import { computed, ref } from 'vue';
import AccordionComponent from '@/components/AccordionComponent.vue';
import ContactFormModal from '@/components/ContactFormModal.vue';
import faqData from '@/data/faq.json';

const { header, questions } = faqData;

const isShowModal = ref(false);

function closeModal() {
  isShowModal.value = false;
}
function showModal() {
  isShowModal.value = true;
}

const resultFaqs = computed(() => questions.map((faq) => {
  return {
    title: faq.title,
    content: faq.content,
    active: false,
  };
}));

</script>

<template>
  <main class="container max-w-screen-lg mx-auto">
    <div class="flex flex-col gap-12 py-16">
      <section class="flex flex-col md:flex-row-reverse md:items-center">
        <img src="/img_components/about-header-desktop.svg" alt="About us" class="hidden w-1/2 h-auto md:block md:-ml-48 md:-z-10" />
        <img src="/img_components/about-header-mobile.svg" alt="About us" class="w-full h-auto md:hidden" />
        <div class="flex flex-col gap-5 md:px-16 md:py-28">
          <h1 class="text-2xl font-bold">{{ header.title }}</h1>
          <div class="space-y-6">
            <p v-for="content in header.content" :key="content" class="md:text-lg">
              {{ content }}
            </p>
            <input type="button" value="聯絡我們" class="w-full px-6 py-3 text-white transition duration-300 rounded-full bg-primary-dark hover:bg-primary hover:cursor-pointer" @click="showModal" />
          </div>
        </div>
      </section>

        <template v-for="(faq, index) in resultFaqs" :key="faq.title">
            <AccordionComponent :title="faq.title" :id="index" :active="faq.active">
              <ul class="pt-4 space-y-4">
                <li class="flex items-center gap-4" v-for="content in faq.content" :key="content">
                  <i class="w-5 h-5 bi bi-asterisk shrink-0 text-primary" />
                  <p class="text-lg leading-normal text-gray-1 dark:text-gray-2">{{ content }}</p>
                </li>
              </ul>
            </AccordionComponent>
        </template>
    </div>
  </main>
  <ContactFormModal :isShowModal="isShowModal" :closeModal="closeModal" />
</template>
