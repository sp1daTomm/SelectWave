<template>
    <div class="flex max-h-screen pt-6 pb-12">
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
                class="block w-full p-4 text-sm bg-white border rounded-full border-gray-3 focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-2"
                :class="{ 'is-invalid': errors['信箱'] }" :disabled="isLoading" placeholder="請輸入信箱" rules="email|required" v-model="user.email">
              </VField>
              <ErrorMessage name="信箱" class="text-sm text-primary-dark"></ErrorMessage>
            </div>
            <div class="relative mb-1">
              <label for="password" class="block mb-2 text-base font-medium text-gray-1">密碼</label>
              <VField id="password" name="密碼" :type="showPassword ? 'text' : 'password'"
                class="block w-full p-4 text-sm bg-white border rounded-full border-gray-3 focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-2"
                :class="{ 'is-invalid': errors['密碼']}" :disabled="isLoading" placeholder="請輸入密碼"
                rules="required|min:8|regex:(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\da-zA-Z])" v-model="user.password">
              </VField>
              <i class="absolute text-xl cursor-pointer -top-1 left-10 "
                :class="showPassword ? 'bi bi-eye-fill' : 'bi bi-eye-slash'" @click="showPassword = !showPassword"></i>
              <ErrorMessage name="密碼" class="text-sm text-primary-dark"></ErrorMessage>
            </div>
            <router-link class="block mb-6 text-sm text-right text-gray-2 hover:text-primary" to="">
              忘記密碼 ?
            </router-link>
            <button type="submit" class="text-white bg-gray-1 hover:bg-primary-dark focus:ring-4
              focus:outline-none focus:ring-primary-light font-medium rounded-full
              text-base w-full sm:w-auto px-5 py-2.5 text-center mb-6
              disabled:bg-gray-2 disabled:opacity-50 disabled:cursor-not-allowed" :disabled="isLoading">
              登入
            </button>
            <p class="mb-4">使用以下方式登入</p>
            <div class="flex items-center gap-2">
              <a class="text-white bg-gray-1 rounded-full
              text-base w-1/4 sm:w-auto py-3.5 hover:bg-primary-dark
              grid place-items-center text-center transition duration-150
              disabled:bg-gray-2 disabled:opacity-50 disabled:cursor-not-allowed"
              v-for="item in thirdParty" :key="item.name"
              :href="`${baseUrl}/api/auth/${item.url}`" :disabled="isLoading">
                <i :class="`bi ${item.icon}`"></i>
              </a>
            </div>
          </VForm>
        </div>
      </div>
    </div>
</template>
<script>
import { useMemberStore } from '@/stores/member';
import { setCookie } from '@/utils';

export default {
  data() {
    return {
      user: {
        email: '',
        password: '',
      },
      showPassword: false,
      thirdParty: [
        {
          name: 'Google',
          icon: 'bi-google',
          url: 'google',
        },
        {
          name: 'Discord',
          icon: 'bi-discord',
          url: 'discord',
        },
        {
          name: 'Line',
          icon: 'bi-line',
          url: 'line',
        },
        {
          name: 'Facebook',
          icon: 'bi-facebook',
          url: 'facebook',
        },
        {
          name: 'Github',
          icon: 'bi-github',
          url: 'github',
        },
      ],
      baseUrl: import.meta.env.VITE_APP_API_URL,
      isLoading: false,
    };
  },
  computed: {
    memberStore() {
      return useMemberStore();
    },
  },
  methods: {
    login() {
      this.isLoading = true;
      const api = `${this.baseUrl}/api/auth/login`;
      this.$http.post(api, this.user)
        .then(({ data }) => {
          if (data.status) {
            const { authToken, member } = data;
            setCookie('selectWaveToken', authToken, 7);
            this.$router.push('/admin');
            this.$swal({
              icon: 'success',
              title: '登入成功',
            });
            this.isLoading = false;
            this.memberStore.setMemberStatus(true);
            this.memberStore.setMemberLoginStatus(true);
            this.memberStore.setMemberData(member);
          }
        })
        .catch((err) => {
          if (err.response) {
            this.$swal({
              icon: 'error',
              title: `${err.response.data.message}`,
            });
            this.isLoading = false;
          }
        });
    },
  },
};
</script>
