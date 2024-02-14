<script setup>
import { Asterisk } from 'lucide-vue-next';
import termsData from '@/data/terms.json';

const {
  header, rules, footer,
} = termsData;
</script>

<template>
  <main class="container flex flex-col gap-8 py-16">
    <section class="flex flex-col gap-6 text-center">
      <h1 class="text-2xl font-bold ">{{ header.title }}</h1>
      <p class="text-lg ">{{ header.subtitle }}</p>
      <p class="text-lg">{{ header.content }}</p>
    </section>
    <section>
      <ul class="flex flex-col gap-8">
        <li v-for="rule in rules" :key="rule.title" class="space-y-5">
          <h2 class="text-xl font-bold ">{{ rule.title }}</h2>
          <div v-for="list in rule.list" :key="list" class="flex flex-col gap-4">
              <li class="flex items-center gap-4">
                <Asterisk class="w-5 h-5 shrink-0 text-primary" />
                <p class="text-lg ">{{ list }}</p>
              </li>
          </div>
        </li>
        <li class="text-center">{{ footer.title }}</li>
      </ul>
    </section>
  </main>
</template>
