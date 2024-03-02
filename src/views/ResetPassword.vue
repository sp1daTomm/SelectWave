<template>
  <div class="pt-6 pb-12">
    <div class="flex min-h-[calc(100vh-326.55px)] md:min-h-[calc(100vh-390px)]">
      <div class="px-3 basis-full">
        <div class="flex items-center justify-center h-full">
          <VForm v-slot="{ errors }" class="mx-auto min-w-96" @submit="resetPassword">
            <div class="mb-6">
              <h2 class="mb-2 text-2xl font-bold md:text-4xl text-gray-1">重設密碼</h2>
            </div>
            <div class="mb-4">
              <label for="password" class="block mb-2 text-base font-medium text-gray-1">密碼</label>
              <VField id="password" name="密碼" :type="showPassword ? 'text' : 'password'"
                class="block w-full p-4 text-sm bg-white border rounded-full border-gray-3 focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-2"
                :class="{ 'is-invalid': errors['密碼'] }" placeholder="請輸入密碼"
                :disabled="isLoading"
                rules="required|min:8|regex:(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\da-zA-Z])" v-model="user.password">
              </VField>
              <p class="mt-2 text-sm text-gray-2"> 請具備 1 個數字， 1 個大寫英文， 1 個小寫英文， 1 個特殊符號，且長度至少為 8 個字元</p>
              <ErrorMessage name="密碼" class="text-sm text-primary-dark"></ErrorMessage>
            </div>
            <div class="mb-4">
              <label for="confirmPassword" class="block mb-2 text-base font-medium text-gray-1">再次輸入密碼</label>
              <VField id="confirmPassword" name="再次輸入密碼" :type="showPassword ? 'text' : 'password'"
                class="block w-full p-4 text-sm bg-white border rounded-full border-gray-3 focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-2"
                :class="{ 'is-invalid': errors['再次輸入密碼'] }" placeholder="請再次輸入密碼" rules="required|confirmed:@密碼"
                :disabled="isLoading"
                v-model="user.confirmPassword">
              </VField>
              <ErrorMessage name="再次輸入密碼" class="text-sm text-primary-dark"></ErrorMessage>
            </div>
            <div class="flex items-start mb-6">
              <div class="flex items-center h-5">
                <input id="showPassword" type="checkbox" class="w-4 h-4 border border-gray-300 rounded text-primary bg-gray-50 focus:ring-3 focus:ring-primary-light" @click="showPassword = !showPassword" :disabled="isLoading" />
              </div>
              <label for="showPassword" class="text-sm font-medium ms-2 text-gray-1">顯示密碼</label>
            </div>
            <button type="submit" class="text-white bg-gray-1 hover:bg-primary focus:ring-4
              focus:outline-none focus:ring-primary-light font-medium rounded-full
              text-base w-full sm:w-auto px-5 py-2.5 text-center mb-6 transition duration-150
              disabled:bg-gray-2 disabled:opacity-50 disabled:cursor-not-allowed" :disabled="isLoading">
              確認
            </button>
          </VForm>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { inject, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import useCookie from '../utils';

const route = useRoute();
const router = useRouter();
const swal = inject('$swal');

const user = ref({
  password: '',
  confirmPassword: '',
});
const showPassword = ref(false);
const isLoading = ref(false);

const resetPassword = async () => {
  const baseUrl = import.meta.env.VITE_APP_API_URL;
  const { token } = route.query;
  isLoading.value = true;
  if (token !== undefined) {
    try {
      const { data } = await axios.put(`${baseUrl}/api/auth/reset-password`, {
        password: user.value.password,
        confirmPassword: user.value.confirmPassword,
        token,
      });
      if (data.status) {
        swal({
          icon: 'success',
          title: '密碼重設成功',
          text: '請重新登入',
          timer: 500,
        });
        router.push('/login');
      }
    } catch (err) {
      if (err.response) {
        swal({
          icon: 'error',
          title: `${err.response.data.message}`,
        });
        isLoading.value = false;
      }
    }
  } else {
    const cookieToken = useCookie.getCookie('selectWaveToken');
    const { data } = await axios.post(`${baseUrl}/api/auth/change-password`, {
      password: user.value.password,
      confirmPassword: user.value.confirmPassword,
    }, {
      headers: {
        Authorization: `Bearer ${cookieToken}`,
      },
    });
    if (data.status) {
      swal({
        icon: 'success',
        title: '密碼重設成功',
        text: '請重新登入',
        timer: 500,
      });
      router.push('/login');
    }
  }
};

</script>
