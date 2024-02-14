<script setup>
import { Asterisk } from 'lucide-vue-next';
import privacyData from '@/data/privacy.json';

const {
  header, rules, footer,
} = privacyData;
</script>

<template>
<main class="container flex flex-col gap-8 py-16">
    <section class="flex flex-col gap-6 text-center">
      <h1 class="text-2xl font-bold">{{ header.title }}</h1>
      <p class="text-lg">{{ header.subtitle }}</p>
      <p class="text-lg">{{ header.content }}</p>
    </section>
    <section class="flex flex-col gap-8">
      <ol class="flex flex-col gap-6">
        <li v-for="rule in rules" :key="rule.title" class="space-y-6">
          <h2 class="text-xl font-bold">{{ rule.title }}</h2>
          <p v-if="rule.content" class="mb-4">{{ rule.content }}</p>
          <div v-for="list in rule.list" :key="list">
            <p v-if="(typeof list) === 'string'">{{ list }}</p>
            <p v-if="list.description" class="mb-4">{{ list.description }}</p>
            <p v-if="(typeof list.list) === 'string'">{{ list.list }}</p>
            <ul v-else class="space-y-4">
              <li v-for="item in list.list" :key="item" class="flex items-center gap-4">
                <Asterisk class="w-5 h-5 shrink-0 text-primary" />
                <p class="text-lg">{{ item }}</p>
              </li>
            </ul>
          </div>
          <p v-if="rule.description" class="text-lg">{{ rule.description }}</p>
        </li>
      </ol>
    </section>
    <section class="flex flex-col gap-6">
      <h1 class="text-2xl font-bold">{{ footer.title }}</h1>
      <ul class="flex flex-col gap-4 py-2" v-for="list in footer.list" :key="list">
        <li class="flex items-center gap-4" v-for="item in list.list" :key="item">
          <Asterisk class="w-5 h-5 shrink-0 text-primary" />
          <p class="text-lg">{{ item }}</p>
        </li>
      </ul>
      <p class="pt-2 text-center">
        {{ footer.description }}
      </p>
    </section>
</main>
</template>
