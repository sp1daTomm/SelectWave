<script setup>
import { Asterisk } from 'lucide-vue-next';
import aboutData from '@/data/about.json';

const {
  headers, features, services, team,
} = aboutData;
</script>

<template>
  <main class="container py-6">
    <section class="py-12">
      <h1 class="mb-5 text-4xl font-bold">{{ headers.title }}</h1>
      <p class="mb-12 text-lg leading-normal">
        {{ headers.content }}
      </p>
      <ul>
        <li v-for="feature in features" :key="feature.title" class="flex flex-col gap-6 py-8 border-t">
          <img :src="feature.imageUrl" :alt="feature.title" class="w-full h-auto mb-4" />
          <div class="space-y-2">
            <h2 class="mb-2 text-2xl font-bold">{{ feature.title }}</h2>
            <p class="text-lg leading-normal">{{ feature.content }}</p>
          </div>
        </li>
      </ul>
    </section>
    <section>
      <h2 class="mb-5 text-4xl font-bold">{{ team.title }}</h2>
      <p class="mb-12 text-lg leading-normal">{{ team.content }}</p>
      <ul class="flex flex-col gap-12">
        <li v-for="member in team.members" :key="member.name" class="flex flex-col items-center gap-2">
          <img :src="member.imageUrl" :alt="member.name" class="object-cover w-3/4 aspect-square" />
          <h3 class="text-xl font-bold">{{ member.name }}</h3>
          <p class="text-lg leading-normal">{{ member.title }}</p>
        </li>
      </ul>
    </section>
    <section class="flex flex-col items-center justify-center gap-6 px-5 py-16 mb-6 text-center">
      <div class="space-y-5">
        <h2 class="mb-5 text-4xl font-bold">我們的合作夥伴</h2>
        <p class="leading-normal">
          我們與政府、企業、非營利組織等合作夥伴共同推動投票文化的普及。
        </p>
      </div>
      <div class="flex flex-col gap-4">
        <input type="button" value="加入我們" class="px-6 py-3 text-white rounded-full bg-primary-dark" />
      </div>
    </section>
    <section class="flex flex-col items-center justify-center px-5 py-16 mb-6">
      <form class="p-8 space-y-6 rounded-2xl bg-gray-4" @submit.prevent="">
        <div class="flex flex-col gap-3">
          <h2 class="mb-5 text-4xl font-bold">訂閱電子報</h2>
          <p>獲取最新資訊與熱門的投票議題</p>
        </div>
        <div class="space-y-4">
          <div class="flex flex-col gap-6">
            <input type="email" placeholder="輸入你的Email" class="px-4 py-3 rounded-full" />
            <input type="submit" value="送出" class="px-6 py-3 text-white rounded-full bg-primary-dark" />
          </div>
          <p>點擊訂閱表示您同意我們 <RouterLink to="/privacy">使用條款與隱私政策</RouterLink>.</p>
        </div>
      </form>
    </section>
    <section class="flex flex-col items-center justify-center gap-8 py-16">
      <div class="flex flex-col gap-8 py-8 border-t" v-for="service in services" :key="service.title">
        <div class="space-y-6">
          <img :src="service.imageUrl" :alt="service.title" class="mx-auto" />
          <div class="flex flex-col gap-5">
            <h2 class="mb-5 text-4xl font-bold">{{ service.title }}</h2>
            <ul class="space-y-4">
              <li class="flex items-center gap-4" v-for="content in service.content" :key="content">
                <Asterisk class="w-5 h-5 shrink-0 text-primary" v-if="service.content.length > 1" />
                <p class="text-lg leading-normal">{{ content }}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
