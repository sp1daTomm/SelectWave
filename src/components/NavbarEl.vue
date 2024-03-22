<template>
  <nav class="sticky top-0 z-10 px-3 py-3 bg-white">
    <div class="flex items-center justify-between max-w-screen-lg mx-auto">
      <div class="flex items-center gap-20">
      <RouterLink :to="{name:'HomeDefault'}">
        <img class="w-12 md:w-16" :src="logoImageUrl" alt="選集">
      </RouterLink>
      <ul class="hidden gap-2 pl-6 md:flex">
        <li class="relative group">
          <RouterLink :to="{name:'Poll'}" :class="[ isActive('Poll') ? 'text-primary' : '']" type="button" class="block w-full px-4 py-2 text-left transition hover:text-primary">開始投票</RouterLink>
          <div :class="[ isActive('Poll') ? 'after:absolute after:bottom-0 after:rounded after:left-1/2 after:-translate-x-1/2 after:w-4 after:h-1 after:bg-primary' : '']"
          class="group-hover:after:absolute group-hover:after:bottom-0 group-hover:after:rounded group-hover:after:left-1/2 group-hover:after:-translate-x-1/2 group-hover:after:w-4 group-hover:after:h-1 group-hover:after:bg-primary"></div>
        </li>
        <li class="relative group">
          <RouterLink :to="{name:'FAQ'}" :class="[ isActive('FAQ') ? 'text-primary' : '']" type="button" class="block w-full px-4 py-2 text-left transition hover:text-primary">常見問題</RouterLink>
          <div
          :class="[ isActive('FAQ') ? 'after:absolute after:bottom-0 after:rounded after:left-1/2 after:-translate-x-1/2 after:w-4 after:h-1 after:bg-primary' : '']"
          class="group-hover:after:absolute group-hover:after:bottom-0 group-hover:after:rounded group-hover:after:left-1/2 group-hover:after:-translate-x-1/2 group-hover:after:w-4 group-hover:after:h-1 group-hover:after:bg-primary"></div>
        </li>
        <li class="relative group">
          <RouterLink :to="{name: 'About'}" :class="[ isActive('About') ? 'text-primary' : '']" type="button" class="block w-full px-4 py-2 text-left transition hover:text-primary">關於我們</RouterLink>
          <div :class="[ isActive('About') ? 'after:absolute after:bottom-0 after:rounded after:left-1/2 after:-translate-x-1/2 after:w-4 after:h-1 after:bg-primary' : '']"
          class="group-hover:after:absolute group-hover:after:bottom-0 group-hover:after:rounded group-hover:after:left-1/2 group-hover:after:-translate-x-1/2 group-hover:after:w-4 group-hover:after:h-1 group-hover:after:bg-primary"></div>
        </li>
      </ul>
    </div>
    <ul class="flex items-center gap-2 ">
        <li v-if="!isLogin" ><RouterLink :to="{name:'Login'}" class="px-6 py-2 transition border-2 border-black rounded-full hover:border-gray-2 hover:bg-gray-2 hover:text-white" :data-test="isLogin">登入</RouterLink></li>
        <li v-if="!isLogin"><RouterLink :to="{name:'Signup'}"  class="px-6 py-2 text-white transition bg-black border-2 border-black rounded-full hover:border-gray-2 hover:bg-gray-2" :data-test="isLogin" >註冊</RouterLink></li>
        <li class="relative" v-else-if="isMember">
          <button @click="toggleMenu" type="button" class="flex items-center gap-2 px-6 py-2 transition border-2 border-black rounded-full hover:bg-gray-2 hover:text-white hover:border-gray-2">
            <img :src="memberStore.member.avatar" class="object-cover w-8 h-8 border-2 rounded-full" alt="avatar" />
            會員中心
        </button>
          <ul v-show="isMenuListOpen"
          :class="{ 'animate-fadeIn': isMenuListOpen, }"
          class="absolute left-0 right-0 p-3 mt-2 text-center bg-white drop-shadow-2xlg rounded-2xl">
            <li>
              <RouterLink :to="{name:'Account'}" :class="[ isActive('Account') ? 'text-primary' : '']" class="w-full py-2 transition hover:text-primary" type="button">帳戶設定</RouterLink>
            </li>
            <li>
              <RouterLink :to="{name:'Vote'}"  :class="[ isActive('Vote') ? 'text-primary' : '']" class="w-full py-2 transition hover:text-primary" type="button">投票項目</RouterLink>
            </li>
            <li>
              <RouterLink :to="{name:'CommentView'}" :class="[ isActive('CommentView') ? 'text-primary' : '']" class="w-full py-2 transition hover:text-primary" type="button">投票評論</RouterLink>
            </li>
            <li>
              <button class="w-full py-2 transition hover:text-primary" type="button" v-if="isMember" @click="doLogout()">登出</button>
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
  class="fixed top-0 bottom-0 left-0 right-0 z-10 p-3 bg-white">
    <div class="flex items-center justify-between py-3">
      <img class="w-12 " :src="logoImageUrl" alt="選集">
      <button @click="closeMenuModal" type="button">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
    </div>
    <ul class="gap-2">
      <li><RouterLink to="/none" type="button" class="block w-full px-4 py-2 text-left transition hover:text-primary">開始投票</RouterLink></li>
      <li><RouterLink to="/faq" type="button" class="block w-full px-4 py-2 text-left transition hover:text-primary">常見問題</RouterLink></li>
      <li><RouterLink to="/about" type="button" class="block w-full px-4 py-2 text-left transition hover:text-primary">關於我們</RouterLink></li>
    </ul>
    <div class="my-4 border-b-2" v-if="isMember"></div>
    <button type="button" class="w-full px-4 py-2 text-left transition hover:text-primary" v-if="isMember" @click="doLogout()">登出</button>
  </div>
</template>
<script>

import { useMemberStore } from '@/stores/member';
import { deleteCookie, getCookie } from '@/utils';

export default {
  data() {
    return {
      isMenuListOpen: false,
      isMenuModalOpen: false,
      logoImageUrl: '/img_components/logo.svg',
      isMember: false,
      isLogin: false,
    };
  },
  computed: {
    memberStore() {
      return useMemberStore();
    },
  },
  watch: {
    memberStore: {
      handler() {
        this.authCheck();
      },
      deep: true,
    },
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
    doLogout() {
      const api = `${import.meta.env.VITE_APP_API_URL}/api/auth/logout`;
      const token = getCookie('selectWaveToken');
      this.$http.get(api, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          this.memberStore.setMemberStatus(false);
          this.memberStore.setMemberLoginStatus(false);
          this.$swal({
            title: `${res.data.message}`,
          });
          deleteCookie('selectWaveToken');
          window.location.href = '/';
        })
        .catch(() => {
        });
    },
    authCheck() {
      this.isLogin = this.memberStore.isLogin;
      this.isMember = this.memberStore.isMember;
    },
    isActive(route) {
      return this.$route.name === route;
    },
  },
  mounted() {
    this.authCheck();
  },
};
</script>
