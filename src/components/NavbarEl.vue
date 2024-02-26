<template>
  <nav class="sticky top-0 z-10 px-3 py-3 bg-white">
    <div class="flex items-center justify-between max-w-screen-lg mx-auto">
      <div class="flex items-center">
      <RouterLink to="/">
        <img class="w-12 md:w-16" :src="logoImageUrl" alt="選集">
      </RouterLink>
      <ul class="hidden gap-2 pl-6 md:flex">
        <li class="relative group">
          <RouterLink to="/terms" type="button" class="block w-full px-4 py-2 text-left transition hover:text-primary">關於我們</RouterLink>
          <div class="group-hover:after:absolute group-hover:after:bottom-0 group-hover:after:rounded group-hover:after:left-1/2 group-hover:after:-translate-x-1/2 group-hover:after:w-4 group-hover:after:h-1 group-hover:after:bg-primary"></div>
        </li>
        <li class="relative group">
          <RouterLink to="/none" type="button" class="block w-full px-4 py-2 text-left transition hover:text-primary">開始投票</RouterLink>
          <div class="group-hover:after:absolute group-hover:after:bottom-0 group-hover:after:rounded group-hover:after:left-1/2 group-hover:after:-translate-x-1/2 group-hover:after:w-4 group-hover:after:h-1 group-hover:after:bg-primary"></div>
        </li>
        <li class="relative group">
          <RouterLink to="/faq" type="button" class="block w-full px-4 py-2 text-left transition hover:text-primary">常見問題</RouterLink>
          <div class="group-hover:after:absolute group-hover:after:bottom-0 group-hover:after:rounded group-hover:after:left-1/2 group-hover:after:-translate-x-1/2 group-hover:after:w-4 group-hover:after:h-1 group-hover:after:bg-primary"></div>
        </li>
        <li class="relative group">
          <RouterLink to="/none" type="button" class="block w-full px-4 py-2 text-left transition hover:text-primary">聯絡我們</RouterLink>
          <div class="group-hover:after:absolute group-hover:after:bottom-0 group-hover:after:rounded group-hover:after:left-1/2 group-hover:after:-translate-x-1/2 group-hover:after:w-4 group-hover:after:h-1 group-hover:after:bg-primary"></div>
        </li>
      </ul>
    </div>
    <ul class="flex items-center gap-2 ">
        <li v-if="!isLogin" ><RouterLink to="/login" class="px-6 py-2 transition border-2 border-black rounded-full hover:border-gray-2 hover:bg-gray-2 hover:text-white" :data-test="isLogin">登入</RouterLink></li>
        <li v-if="!isLogin"><RouterLink to="/signup" class="px-6 py-2 text-white transition bg-black border-2 border-black rounded-full hover:border-gray-2 hover:bg-gray-2"  >註冊</RouterLink></li>
        <li class="relative" v-else-if="isMember" :data-test="isLogin">
          <button @click="toggleMenu" type="button" class="flex items-center gap-2 px-6 py-2 transition border-2 border-black rounded-full hover:bg-gray-2 hover:text-white hover:border-gray-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-user-round"><path d="M18 20a6 6 0 0 0-12 0"/><circle cx="12" cy="10" r="4"/><circle cx="12" cy="12" r="10"/></svg>會員中心
        </button>
          <ul v-show="isMenuListOpen"
          :class="{ 'animate-fadeIn': isMenuListOpen, }"
          class="absolute left-0 right-0 p-3 mt-2 text-center bg-white drop-shadow-2xlg rounded-2xl">
            <li>
              <button class="w-full py-2 transition hover:text-primary" type="button">帳戶設定</button>
            </li>
            <li>
              <button class="w-full py-2 transition hover:text-primary" type="button">投票項目</button>
            </li>
            <li>
              <button class="w-full py-2 transition hover:text-primary" type="button">投票評論</button>
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
      <li><RouterLink to="/terms" type="button" class="block w-full px-4 py-2 text-left transition hover:text-primary">關於我們</RouterLink></li>
      <li><RouterLink to="/none" type="button" class="block w-full px-4 py-2 text-left transition hover:text-primary">開始投票</RouterLink></li>
      <li><RouterLink to="/faq" type="button" class="block w-full px-4 py-2 text-left transition hover:text-primary">常見問題</RouterLink></li>
      <li><RouterLink to="/none" type="button" class="block w-full px-4 py-2 text-left transition hover:text-primary">聯絡我們</RouterLink></li>
    </ul>
    <div class="my-4 border-b-2" v-if="isMember"></div>
    <button type="button" class="w-full px-4 py-2 text-left transition hover:text-primary" v-if="isMember" @click="doLogout()">登出</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isMenuListOpen: false,
      isMenuModalOpen: false,
      logoImageUrl: '/img_components/logo.svg',
      isLogin: false,
      isMember: false,
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
    doLogout() {
      const api = `${import.meta.env.VITE_APP_API_URL}/api/auth/logout`;
      this.$http.get(api)
        .then((res) => {
          console.log(res);
          this.isLogin = false;
          this.isMember = false;
          this.$swal({
            title: `${res.data.message}`,
          }).then(() => {
            document.cookie = 'selectWaveToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.location.href = '/HomeView.vue';
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    checkToken() {
      const cookies = document.cookie.split(';').map((cookie) => cookie.trim());
      const tokenCookie = cookies.find((cookie) => cookie.startsWith('selectWaveToken='));
      const isTokenNotEmpty = tokenCookie && tokenCookie.split('=')[1].length > 0;
      return isTokenNotEmpty;
    },
    authCheck() {
      const auth = this.$route.query.token;
      const baseUrl = import.meta.env.VITE_APP_API_URL;
      const api = `${baseUrl}/api/auth/check`;
      console.log(auth);
      if (auth) {
        this.$http.get(api, {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        }).then(({ data }) => {
          console.log(data);
          if (data.status) {
            localStorage.setItem('selectWaveToken', auth);
            this.$swal({
              toast: true,
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              position: 'top-end',
              html: `
              <h2 class="mb-4 text-2xl font-bold">登入成功</h2>
              <div class="flex items-center gap-4">
                <img src=${data.result.avatar} class="w-20 h-20 object-fit" />
                <p>歡迎回來 ${data.result.name}</p>
              </div>`,
            });
            this.isLogin = true;
            this.isMember = true;
          }
        }).catch(() => {
        });
      } else if (this.checkToken()) {
        this.$http.get(api)
          .then((res) => {
            if (res.status === false) {
              this.isLogin = false;
              this.isMember = false;
            } else {
              this.isLogin = true;
              this.isMember = true;
            }
          })
          .catch(() => {
            // console.log(err);
          });
      }
    },
  },
  mounted() {
    this.authCheck();
  },
};
</script>
