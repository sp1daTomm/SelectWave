<template>
  <div class="max-w-screen-lg mx-auto py-7 md:py-20 px-3 min-h-full grid">
    <div class="flex justify-center items-center h-full">
      <div class="basis-1/2 hidden md:block">
        <img src="/images/signupCover.png" alt="註冊頁面">
      </div>
      <div class="basis-full md:basis-1/2">
        <VForm v-slot="{ errors }" class="max-w-sm mx-auto" @submit.prevent="signup">
          <div class="mb-4">
            <h2 class="text-2xl md:text-4xl font-bold mb-2 text-gray-1">註冊</h2>
            <span class="text-gray-1">已經有帳號嗎？</span>
            <router-link class="text-gray-2 hover:text-primary" to="/login">前往登入</router-link>
          </div>
          <div class="mb-4">
            <label for="email" class="block mb-2 text-base font-medium text-gray-1">Email</label>
            <VField id="email" name="信箱" type="email"
              class="bg-white border border-gray-3 text-sm rounded-full focus:ring-primary focus:border-primary block w-full px-3 py-4"
              :class="{ 'is-invalid': errors['信箱'] }" placeholder="請輸入信箱" rules="email|required" v-model="user.email">
            </VField>
            <ErrorMessage name="信箱" class="text-primary-dark text-sm"></ErrorMessage>
          </div>
          <div class="mb-4">
            <label for="password" class="block mb-2 text-base font-medium text-gray-1">密碼</label>
            <VField id="password" name="密碼" :type="showPassword ? 'text' : 'password'"
              class="bg-white border border-gray-3 text-sm rounded-full focus:ring-primary focus:border-primary block w-full px-3 py-4"
              :class="{ 'is-invalid': errors['密碼'] }" placeholder="請輸入密碼"
              rules="required|min:8|regex:(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\da-zA-Z])" v-model="user.password">
            </VField>
            <p class="mt-2 text-sm text-gray-2"> 請具備 1 個數字， 1 個大寫英文， 1 個小寫英文， 1 個特殊符號，且長度至少為 8 個字元</p>
            <ErrorMessage name="密碼" class="text-primary-dark text-sm"></ErrorMessage>
          </div>
          <div class="mb-4">
            <label for="confirmPassword" class="block mb-2 text-base font-medium text-gray-1">再次輸入密碼</label>
            <VField id="confirmPassword" name="再次輸入密碼" :type="showPassword ? 'text' : 'password'"
              class="bg-white border border-gray-3 text-sm rounded-full focus:ring-primary focus:border-primary block w-full px-3 py-4"
              :class="{ 'is-invalid': errors['再次輸入密碼'] }" placeholder="請再次輸入密碼" rules="required|confirmed:@密碼"
              v-model="user.confirmPassword">
            </VField>
            <ErrorMessage name="再次輸入密碼" class="text-primary-dark text-sm"></ErrorMessage>
          </div>
          <div class="flex items-start mb-4">
            <div class="flex items-center h-5">
              <input id="showPassword" type="checkbox"
              class="w-4 h-4 border border-gray-300 text-primary rounded
                bg-gray-50 focus:ring-3 focus:ring-primary-light" @click="showPassword = !showPassword" />
            </div>
            <label for="showPassword" class="ms-2 text-sm font-medium text-gray-1">顯示密碼</label>
          </div>
          <div class="flex items-start mb-6">
            <div class="flex items-center h-5">
              <input id="remember" type="checkbox" value="" class="w-4 h-4 border border-gray-300 text-primary rounded
                bg-gray-50 focus:ring-3 focus:ring-primary-light" required />
            </div>
            <label for="remember" class="ms-2 text-sm font-medium text-gray-1">
              同意
              <router-link class="text-gray-2" target="_blank" to="/terms">使用規範</router-link>、
              <router-link class="text-gray-2" target="_blank" to="/privacy">隱私權政策</router-link>
            </label>
          </div>
          <button type="submit" class="text-white bg-gray-1 hover:bg-primary focus:ring-4
            focus:outline-none focus:ring-primary-light font-medium rounded-full
            text-base w-full sm:w-auto px-5 py-2.5 text-center">
            註冊帳號
          </button>
        </VForm>
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
      showPassword: false,
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
