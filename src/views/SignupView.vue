<template>
  <div class="max-w-screen-lg mx-auto py-7 md:py-20 px-3 min-h-full grid">
    <div class="flex justify-center items-center h-full">
      <div class="basis-1/2 hidden md:block">
        <img src="/images/signupCover.png" alt="註冊頁面">
      </div>
      <div class="basis-full md:basis-1/2">
        <form class="max-w-sm mx-auto" @submit.prevent="signup">
          <div class="mb-4">
            <h2 class="text-2xl md:text-4xl font-bold mb-2 text-gray-1">註冊</h2>
            <span class="text-gray-1">已經有帳號嗎？</span>
            <router-link class="text-gray-2 hover:text-primary" to="/login">前往登入</router-link>
          </div>
          <div class="mb-4">
            <label for="email" class="block mb-2 text-base font-medium text-gray-1">Email</label>
            <input type="email" id="email" class="bg-white border border-gray-3 text-sm rounded-3xl
              focus:ring-primary focus:border-primary block w-full px-3 py-4" placeholder="請輸入信箱" required
              v-model="user.email" />
          </div>
          <div class="mb-4">
            <label for="password" class="block mb-2 text-base font-medium text-gray-1">密碼</label>
            <input type="password" id="password" class="bg-white border border-gray-3 text-sm rounded-3xl
              focus:ring-primary focus:border-primary block w-full px-3 py-4" placeholder="請輸入密碼" required
              v-model="user.password" />
          </div>
          <div class="mb-4">
            <label for="passwordAgain" class="block mb-2 text-base font-medium text-gray-1">再次輸入密碼</label>
            <input type="password" id="passwordAgain" class="bg-white border border-gray-3 text-sm rounded-3xl
              focus:ring-primary focus:border-primary block w-full px-3 py-4" placeholder="請再次輸入密碼" required
              v-model="user.confirmPassword" />
          </div>
          <div class="flex items-start mb-6">
            <div class="flex items-center h-5">
              <input id="remember" type="checkbox" value="" class="w-4 h-4 border border-gray-300 text-primary rounded
                bg-gray-50 focus:ring-3 focus:ring-primary-light" required />
            </div>
            <label for="remember" class="ms-2 text-sm font-medium text-gray-900">
              同意
              <router-link class="text-gray-2" target="_blank" to="/terms">使用規範</router-link>、
              <router-link class="text-gray-2" target="_blank" to="/privacy">隱私權政策</router-link>
            </label>
          </div>
          <button type="submit" class="text-white bg-gray-1 hover:bg-primary focus:ring-4
            focus:outline-none focus:ring-primary-light font-medium rounded-3xl
            text-base w-full sm:w-auto px-5 py-2.5 text-center">
            註冊帳號
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      user: {
        email: '',
        password: '',
        confirmPassword: '',
      },
    };
  },
  methods: {
    signup() {
      const api = `${import.meta.env.VITE_APP_API_URL}/api/auth/register`;
      this.$http.post(api, this.user)
        .then((res) => {
          console.log(res);
          console.log(res.data.result.token);
          if (res.data.status) {
            const { token } = res.data.result;
            document.cookie = `selectWaveToken=${token};`;
            this.$swal({
              title: `${res.data.message}`,
            });
            this.user.email = '';
            this.user.password = '';
            this.user.confirmPassword = '';
          }
        })
        .catch((err) => {
          this.$swal({
            title: `${err.response.data.message}`,
          });
        });
    },
  },
};
</script>

<style scoped></style>
