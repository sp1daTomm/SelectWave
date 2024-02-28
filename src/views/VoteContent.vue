<template>
  <main>
    <section class="py-8 md:py-20 max-w-screen-lg mx-auto px-3">
      <h1 class="text-2xl md:text-3xl leading-normal font-semibold">輕鬆建立投票所，讓您的聲音成為力量。</h1>
      <p class="md:text-xl text-gray-2 py-3">目前電視節目玲琅滿目，你最喜歡哪一台呢？</p>
      <ul class="flex gap-3 flex-wrap">
        <li><span class="text-primary pr-1 font-bold">#</span>公開投票</li>
        <li><span class="text-primary pr-1 font-bold">#</span>標籤01</li>
        <li><span class="text-primary pr-1 font-bold">#</span>標籤02</li>
        <li><span class="text-primary pr-1 font-bold">#</span>標籤03</li>
      </ul>
      <div class="flex items-center py-6">
        <div :style="{ backgroundImage:bgPersonImg}" class="w-8 h-8 rounded-full bg-cover"></div>
        <p class="pl-3 pr-4 font-medium">王小明</p>
        <div class="px-3 py-1 border-gray-2 border rounded-full border-2 text-gray-2">發起人</div>
      </div>
      <ul class="flex flex-col gap-3">
        <li class="flex items-center border rounded-3xl border-2 border-gray-3 p-3 relative">
          <input type="radio" name="flexRadioDefault" value="a" id="flexCheckDefault01" class="focus:ring-primary text-primary" v-model="selectedRadio">
          <label for="flexCheckDefault01" class="flex items-center justify-between w-full gap-3" :class="selectedRadio === 'a' ? 'red' : 'nonee'">
            <p class="pl-3 flex-grow">a.晚間新聞</p><p class="text-gray-2 flex-shrink-0" :class="{'text-amber-600': selectedRadio === 'a'}">38票</p>
          </label>
          <div class="absolute bg-gray-4 inset-y-0 right-0 left-[62%] z-[-1] rounded-r-3xl"
          :class="radioClass">
          </div>
        </li>
        <li class="flex items-center border rounded-3xl border-2 border-gray-3 p-3 relative">
          <input type="radio" name="flexRadioDefault" value="b" id="flexCheckDefault02" class="focus:ring-primary text-primary" v-model="selectedRadio">
          <label for="flexCheckDefault02" class="flex items-center justify-between w-full gap-3"  :class="selectedRadio === 'b' ? 'red' : 'nonee'">
            <p class="pl-3 flex-grow">b.晚間新聞</p><p class="text-gray-2 flex-shrink-0" :class="{'text-amber-600': selectedRadio === 'a'}">38票</p>
          </label>
          <div class="absolute bg-gray-4 inset-y-0 right-0 left-[62%] z-[-1] rounded-r-3xl">
          </div>
        </li>
      </ul>
      {{ selectedRadio }}
    </section>
    <section class="max-w-screen-lg mx-auto px-3 flex gap-4">
      <button class="w-10 h-10 bg-gray-4 rounded-full" type="button"><i class="bi bi-link"></i></button>
      <button type="button" class="px-6 py-2 border-2 border-black rounded-full bg-black text-white hover:border-gray-2 hover:bg-gray-2 transition grow">送出投票</button>
    </section>
    <section class="max-w-screen-lg mx-auto px-3  gap-4 py-6">
      <div class="flex">
        <div class="flex justify-between w-full items-center">
          <h2 class="text-gray-1 pt-6 pb-4 text-xl md:text-3xl text-center leading-normal font-semibold md:pb-8">討論區</h2>
          <p class="text-gray-1">2則留言</p>
        </div>
      </div>
      <div class="p-4">
        <div class="flex items-center py-6">
          <div :style="{ backgroundImage:bgPersonImg}" class="w-8 h-8 rounded-full bg-cover"></div>
          <p class="pl-3 pr-4 font-medium">王小明</p>
        </div>
        <div >
          <input type="text" class="rounded-full block mb-4">
          <button type="button" class="px-6 py-2 border-2 border-black rounded-full bg-black text-white hover:border-gray-2 hover:bg-gray-2 transition grow">送出</button>
        </div>
      </div>
    </section>

  </main>
</template>
<script setup>
// const personImg = '/images/loginCover.png';
import { ref } from 'vue';

const selectedRadio = ref(null);
const bgPersonImg = 'url("/images/loginCover.png")';
</script>
