<template>
    <div class="flex items-center justify-center h-full max-w-screen-lg min-h-screen px-3 mx-auto py-7 md:py-20">
      <div class="hidden basis-1/2 md:block">
        <img src="/images/signupCover.svg" alt="註冊頁面">
      </div>
      <div class="basis-full md:basis-1/2">
        <VForm v-slot="{ errors }" class="max-w-sm mx-auto" @submit="signup">
          <div class="mb-4">
            <h2 class="mb-2 text-2xl font-bold md:text-4xl text-gray-1">註冊</h2>
            <span class="text-gray-1">已經有帳號嗎？</span>
            <router-link class="text-gray-2 hover:text-primary" to="/login">前往登入</router-link>
          </div>
          <div class="mb-4">
            <label for="email" class="block mb-2 text-base font-medium text-gray-1">Email</label>
            <VField id="email" name="信箱" type="email"
              class="block w-full p-4 text-sm bg-white border rounded-full border-gray-3 focus:ring-primary focus:border-primary"
              :class="{ 'is-invalid': errors['信箱'] }" :disabled="isLoading" placeholder="請輸入信箱" rules="email|required" v-model="user.email">
            </VField>
            <ErrorMessage name="信箱" class="text-sm text-primary-dark"></ErrorMessage>
          </div>
          <div class="mb-4">
            <label for="password" class="block mb-2 text-base font-medium text-gray-1">密碼</label>
            <VField id="password" name="密碼" :type="showPassword ? 'text' : 'password'"
              class="block w-full p-4 text-sm bg-white border rounded-full border-gray-3 focus:ring-primary focus:border-primary"
              :class="{ 'is-invalid': errors['密碼'] }" :disabled="isLoading" placeholder="請輸入密碼"
              rules="required|min:8|regex:(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\da-zA-Z])" v-model="user.password">
            </VField>
            <p class="mt-2 text-sm text-gray-2"> 請具備 1 個數字， 1 個大寫英文， 1 個小寫英文， 1 個特殊符號，且長度至少為 8 個字元</p>
            <ErrorMessage name="密碼" class="text-sm text-primary-dark"></ErrorMessage>
          </div>
          <div class="mb-4">
            <label for="confirmPassword" class="block mb-2 text-base font-medium text-gray-1">再次輸入密碼</label>
            <VField id="confirmPassword" name="再次輸入密碼" :type="showPassword ? 'text' : 'password'"
              class="block w-full p-4 text-sm bg-white border rounded-full border-gray-3 focus:ring-primary focus:border-primary"
              :class="{ 'is-invalid': errors['再次輸入密碼'] }" :disabled="isLoading" placeholder="請再次輸入密碼" rules="required|confirmed:@密碼"
              v-model="user.confirmPassword">
            </VField>
            <ErrorMessage name="再次輸入密碼" class="text-sm text-primary-dark"></ErrorMessage>
          </div>
          <div class="flex items-start mb-4">
            <div class="flex items-center h-5">
              <input id="showPassword" type="checkbox"
              class="w-4 h-4 border border-gray-300 rounded text-primary bg-gray-50 focus:ring-3 focus:ring-primary-light" :disabled="isLoading" @click="showPassword = !showPassword" />
            </div>
            <label for="showPassword" class="text-sm font-medium ms-2 text-gray-1">顯示密碼</label>
          </div>
          <div class="flex flex-col items-start mb-6">
              <div class="flex items-center h-5">
                <VField id="agreePrivacy" name="agreePrivacy" type="checkbox" v-model="user.agreePrivacy" class="w-4 h-4 border border-gray-300 rounded text-primary bg-gray-50 focus:ring-3 focus:ring-primary-light" :rules="{is: true}" :disabled="isLoading" />
                <label for="agreePrivacy" class="text-sm font-medium text-gray-900 ms-2" :class="{'is-invalid': errors['agreePrivacy']}">
                  同意
                  <router-link class="text-gray-2" target="_blank" to="/terms">使用規範</router-link>、
                  <router-link class="text-gray-2" target="_blank" to="/privacy">隱私權政策</router-link>
                </label>
              </div>
              <p class="text-sm text-primary-dark" v-if="errors['agreePrivacy']">{{ errors['agreePrivacy'] && '請同意使用規範及隱私權政策' }}</p>
            </div>
          <button type="submit" class="text-white bg-gray-1 hover:bg-primary-dark focus:ring-4
            focus:outline-none focus:ring-primary-light font-medium rounded-full
            text-base w-full sm:w-auto px-5 py-2.5 text-center" :disabled="isLoading">
            註冊帳號
          </button>
        </VForm>
      </div>
    </div>
</template>
<script>
import { setCookie } from '@/utils';

export default {
  data() {
    return {
      user: {
        email: '',
        password: '',
        confirmPassword: '',
        agreePrivacy: false,
      },
      showPassword: false,
      isLoading: false,
    };
  },
  methods: {
    signup() {
      this.isLoading = true;
      const api = `${import.meta.env.VITE_APP_API_URL}/api/auth/register`;
      this.$http.post(api, this.user)
        .then(({ data }) => {
          if (data.status) {
            const { token } = data.result;
            setCookie('selectWaveToken', token, 7);
            this.$swal({
              title: `${data.message}`,
              icon: 'success',
              text: '歡迎加入 SelectWave',
            }).then(() => {
              window.location.href = '/';
              this.user.email = '';
              this.user.password = '';
              this.user.confirmPassword = '';
            });
            this.isLoading = false;
          }
        })
        .catch((err) => {
          if (err.response) {
            this.$swal({
              title: `${err.response.data.message}`,
            });
          }
          this.isLoading = false;
        });
    },
  },
};
</script>

<style scoped></style>
