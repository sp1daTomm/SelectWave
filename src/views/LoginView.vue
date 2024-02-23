<template>
  <div class="grid min-h-full pt-6 pb-12">
    <div class="flex">
      <div class="hidden min-h-screen bg-center bg-no-repeat bg-cover basis-1/2 min-w-screen md:block" style="background-image: url('./images/loginCover.png');">
      </div>
      <div class="px-3 basis-full md:basis-1/2">
        <div class="flex items-center justify-center h-full">
          <VForm v-slot="{ errors }" class="mx-auto min-w-96" @submit="login">
            <div class="mb-4">
              <h2 class="mb-2 text-2xl font-bold md:text-4xl text-gray-1">登入</h2>
              <span class="text-gray-1">尚未成為會員？</span>
              <router-link class="text-gray-2 hover:text-primary" to="/signup">前往註冊</router-link>
            </div>
            <div class="mb-4">
              <label for="email" class="block mb-2 text-base font-medium text-gray-1">Email</label>
              <VField id="email" name="信箱" type="email"
                class="block w-full px-3 py-4 text-sm bg-white border rounded-full border-gray-3 focus:ring-primary focus:border-primary"
                :class="{ 'is-invalid': errors['信箱'] }" placeholder="請輸入信箱" rules="email|required" v-model="user.email">
              </VField>
              <ErrorMessage name="信箱" class="text-sm text-primary-dark"></ErrorMessage>
            </div>
            <div class="relative mb-1">
              <label for="password" class="block mb-2 text-base font-medium text-gray-1">密碼</label>
              <VField id="password" name="密碼" :type="showPassword ? 'text' : 'password'"
                class="block w-full px-3 py-4 text-sm bg-white border rounded-full border-gray-3 focus:ring-primary focus:border-primary"
                :class="{ 'is-invalid': errors['密碼'] }" placeholder="請輸入密碼"
                rules="required|min:8|regex:(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\da-zA-Z])" v-model="user.password">
              </VField>
              <i class="absolute text-xl cursor-pointer -right-8 top-11"
                :class="showPassword ? 'bi bi-eye-fill' : 'bi bi-eye-slash'" @click="showPassword = !showPassword"></i>
              <ErrorMessage name="密碼" class="text-sm text-primary-dark"></ErrorMessage>
            </div>
            <router-link class="block mb-6 text-sm text-right text-gray-2 hover:text-primary" to="">
              忘記密碼 ?
            </router-link>
            <div class="flex items-start mb-6">
              <div class="flex items-center h-5">
                <input id="remember" type="checkbox" value="" class="w-4 h-4 border border-gray-300 rounded text-primary bg-gray-50 focus:ring-3 focus:ring-primary-light" required />
              </div>
              <label for="remember" class="text-sm font-medium text-gray-900 ms-2">
                同意
                <router-link class="text-gray-2" target="_blank" to="/terms">使用規範</router-link>、
                <router-link class="text-gray-2" target="_blank" to="/privacy">隱私權政策</router-link>
              </label>
            </div>
            <button type="submit" class="text-white bg-gray-1 hover:bg-primary focus:ring-4
              focus:outline-none focus:ring-primary-light font-medium rounded-full
              text-base w-full sm:w-auto px-5 py-2.5 text-center mb-6">
              登入
            </button>
            <p class="mb-4">使用以下方式登入</p>
            <div class="flex justify-between">
              <button type="button" class="text-white bg-gray-1 rounded-full
              text-base w-1/4 sm:w-auto py-3.5 hover:bg-primary">
                <i class="bi bi-google"></i>
              </button>
              <button type="button" class="text-white bg-gray-1 rounded-full
              text-base w-1/4 sm:w-auto py-3.5 hover:bg-primary">
                <i class="bi bi-discord"></i>
              </button>
              <button type="button" class="text-white bg-gray-1 rounded-full
              text-base w-1/4 sm:w-auto py-3.5 hover:bg-primary">
                <i class="bi bi-line"></i>
              </button>
            </div>
          </VForm>
        </div>
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
      },
      showPassword: false,
    };
  },
  methods: {
    login() {
      const api = `${process.env.NODE_ENV === 'production' ? import.meta.env.VITE_APP_API_URL : 'http://localhost:8081'}/api/auth/login`;
      this.$http.post(api, this.user)
        .then((res) => {
          console.log(res);
          if (res.data.status) {
            const { authToken } = res.data;
            document.cookie = `selectWaveToken=${authToken};`;
            this.$router.push('/admin');
            this.$swal({
              title: `${res.data.message}`,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.user.email = '';
          this.user.password = '';
          this.$swal({
            title: `${err.response.data.message}`,
          });
        });
    },
  },
};
</script>

<style scoped></style>
