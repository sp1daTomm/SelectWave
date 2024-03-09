<template>
  <Navbar />
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
                class="block w-full px-3 py-4 text-sm bg-white border rounded-full border-gray-3 focus:ring-primary focus:border-primary"
                :class="{ 'is-invalid': errors['密碼'] }" placeholder="請輸入密碼"
                rules="required|min:8|regex:(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\da-zA-Z])" v-model="user.password">
              </VField>
              <p class="mt-2 text-sm text-gray-2"> 請具備 1 個數字， 1 個大寫英文， 1 個小寫英文， 1 個特殊符號，且長度至少為 8 個字元</p>
              <ErrorMessage name="密碼" class="text-sm text-primary-dark"></ErrorMessage>
            </div>
            <div class="mb-4">
              <label for="confirmPassword" class="block mb-2 text-base font-medium text-gray-1">再次輸入密碼</label>
              <VField id="confirmPassword" name="再次輸入密碼" :type="showPassword ? 'text' : 'password'"
                class="block w-full px-3 py-4 text-sm bg-white border rounded-full border-gray-3 focus:ring-primary focus:border-primary"
                :class="{ 'is-invalid': errors['再次輸入密碼'] }" placeholder="請再次輸入密碼" rules="required|confirmed:@密碼"
                v-model="user.confirmPassword">
              </VField>
              <ErrorMessage name="再次輸入密碼" class="text-sm text-primary-dark"></ErrorMessage>
            </div>
            <div class="flex items-start mb-6">
              <div class="flex items-center h-5">
                <input id="showPassword" type="checkbox" class="w-4 h-4 border border-gray-300 rounded text-primary bg-gray-50 focus:ring-3 focus:ring-primary-light" @click="showPassword = !showPassword" />
              </div>
              <label for="showPassword" class="text-sm font-medium ms-2 text-gray-1">顯示密碼</label>
            </div>
            <button type="submit" class="text-white bg-gray-1 hover:bg-primary focus:ring-4
              focus:outline-none focus:ring-primary-light font-medium rounded-full
              text-base w-full sm:w-auto px-5 py-2.5 text-center mb-6">
              確認
            </button>
          </VForm>
        </div>
      </div>
    </div>
  </div>
  <ComponentFooter />
</template>
<script>
import ComponentFooter from '@/components/ComponentFooter.vue';
import Navbar from '@/components/NavbarEl.vue';

export default {
  components: {
    Navbar,
    ComponentFooter,
  },
  data() {
    return {
      user: {
        password: '',
        confirmPassword: '',
      },
      showPassword: false,
    };
  },
  methods: {
    resetPassword() {

    },
  },
};
</script>
