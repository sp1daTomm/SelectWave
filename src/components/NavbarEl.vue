<template>
  <nav class="py-3 px-3 sticky top-0 bg-white">
    <div class="flex items-center justify-between max-w-screen-lg mx-auto">
      <div class="flex">
      <RouterLink to="/">
        <img class=" w-12 md:w-16" :src="logoImageUrl" alt="選集">
      </RouterLink>
      <ul class="gap-2 pl-6 hidden md:flex">
        <li class="group relative">
          <RouterLink to="/terms" type="button" class="py-2 px-4 block w-full text-left transition
          hover:text-primary">關於我們</RouterLink>
          <div class="group-hover:after:absolute group-hover:after:bottom-0
          group-hover:after:rounded
          group-hover:after:left-1/2 group-hover:after:-translate-x-1/2
          group-hover:after:w-4 group-hover:after:h-1 group-hover:after:bg-primary"></div>
        </li>
        <li class="group relative">
          <RouterLink to="/" type="button" class="py-2 px-4 block w-full text-left transition
          hover:text-primary">開始投票</RouterLink>
          <div class="group-hover:after:absolute group-hover:after:bottom-0
          group-hover:after:rounded
          group-hover:after:left-1/2 group-hover:after:-translate-x-1/2
          group-hover:after:w-4 group-hover:after:h-1 group-hover:after:bg-primary"></div>
        </li>
        <li class="group relative">
          <RouterLink to="/" type="button" class="py-2 px-4 block w-full text-left transition
          hover:text-primary">常見問題</RouterLink>
          <div class="group-hover:after:absolute group-hover:after:bottom-0
          group-hover:after:rounded
          group-hover:after:left-1/2 group-hover:after:-translate-x-1/2
          group-hover:after:w-4 group-hover:after:h-1 group-hover:after:bg-primary"></div>
        </li>
        <li class="group relative">
          <RouterLink to="/" type="button" class="py-2 px-4 block w-full text-left transition
          hover:text-primary">聯絡我們</RouterLink>
          <div class="group-hover:after:absolute group-hover:after:bottom-0
          group-hover:after:rounded
          group-hover:after:left-1/2 group-hover:after:-translate-x-1/2
          group-hover:after:w-4 group-hover:after:h-1 group-hover:after:bg-primary"></div>
        </li>
      </ul>
    </div>
    <ul class="flex items-center gap-2 ">
        <li><RouterLink to="/" type="button" class="px-6 py-2 border-2 border-black
          rounded-full hover:border-gray-2 hover:bg-gray-2 hover:text-white
          transition">登入</RouterLink></li>
        <li><RouterLink to="/" type="button" class="px-6 py-2 border-2 border-black
          rounded-full bg-black text-white hover:border-gray-2 hover:bg-gray-2
          transition">註冊</RouterLink></li>
        <li class="relative">
          <button @click="toggleMenu" type="button" class="px-6 py-2 border-2 border-black
          rounded-full flex gap-2 items-center hover:bg-gray-2 hover:text-white
          hover:border-gray-2
          transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-user-round"><path d="M18 20a6 6 0 0 0-12 0"/><circle cx="12" cy="10" r="4"/><circle cx="12" cy="12" r="10"/></svg>會員中心
        </button>
          <ul v-show="isMenuListOpen"
          :class="{ 'animate-fadeIn': isMenuListOpen, }"
          class="absolute left-0 right-0 mt-2 p-3 bg-white drop-shadow-2xlg rounded-2xl
          text-center">
            <li>
              <button class="py-2 transition hover:text-primary w-full" type="button">帳戶設定</button>
            </li>
            <li>
              <button class="py-2 transition hover:text-primary w-full" type="button">投票項目</button>
            </li>
            <li>
              <button class="py-2 transition hover:text-primary w-full" type="button">投票評論</button>
            </li>
            <li>
              <button class="py-2 transition hover:text-primary w-full" type="button">登出</button>
            </li>
          </ul>
        </li>
        <li class="md:hidden">
          <button type="button" class="p-2" @click="openMenuModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-align-justify"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
          </button>
        </li>
    </ul>
    </div>
  </nav>
  <div v-show="isMenuModalOpen" :class="{ 'animate-fadeIn': isMenuModalOpen, }"
  class="fixed top-0 left-0 right-0 bottom-0 bg-white z-10 p-3">
    <div class="flex justify-between items-center py-3">
      <img class=" w-12" :src="logoImageUrl" alt="選集">
      <button @click="closeMenuModal" type="button">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
    </div>
    <ul class="gap-2">
      <li><RouterLink to="/" type="button" class="py-2 px-4 block w-full text-left
        transition hover:text-primary">關於我們</RouterLink></li>
      <li><RouterLink to="/" type="button" class="py-2 px-4 block w-full text-left
        transition hover:text-primary">開始投票</RouterLink></li>
      <li><RouterLink to="/" type="button" class="py-2 px-4 block w-full text-left
        transition hover:text-primary">常見問題</RouterLink></li>
      <li><RouterLink to="/" type="button" class="py-2 px-4 block w-full text-left
        transition hover:text-primary">聯絡我們</RouterLink></li>
    </ul>
    <div class="border-b-2 my-4"></div>
    <button type="button" class="py-2 px-4 w-full text-left
    transition hover:text-primary">登出</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isMenuListOpen: false,
      isMenuModalOpen: false,
      logoImageUrl: '/img_components/logo.svg',
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuListOpen = !this.isMenuListOpen;
    },

    openMenuModal() {
      this.isMenuModalOpen = true;
    },

    closeMenuModal() {
      this.isMenuModalOpen = false;
    },
  },
};
</script>
