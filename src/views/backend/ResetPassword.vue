<template>
  <Navbar />
  <div class="pt-6 pb-12">
    <div class="flex calcHeight">
      <div class="basis-full  px-3">
        <div class="flex justify-center items-center h-full">
          <VForm v-slot="{ errors }" class="min-w-96 mx-auto" @submit="resetPassword">
            <div class="mb-6">
              <h2 class="text-2xl md:text-4xl font-bold mb-2 text-gray-1">重設密碼</h2>
            </div>
            <div class="mb-4">
              <label for="password" class="block mb-2 text-base font-medium text-gray-1">密碼</label>
              <VField id="password" name="密碼" :type="showPassword ? 'text' : 'password'"
                class="bg-white border border-gray-3 text-sm rounded-3xl focus:ring-primary focus:border-primary block w-full px-3 py-4"
                :class="{ 'is-invalid': errors['密碼'] }" placeholder="請輸入密碼"
                rules="required|min:8|regex:(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\da-zA-Z])" v-model="user.password">
              </VField>
              <p class="mt-2 text-sm text-gray-2"> 請具備 1 個數字， 1 個大寫英文， 1 個小寫英文， 1 個特殊符號，且長度至少為 8 個字元</p>
              <ErrorMessage name="密碼" class="text-red-600 text-sm"></ErrorMessage>
            </div>
            <div class="mb-4">
              <label for="confirmPassword" class="block mb-2 text-base font-medium text-gray-1">再次輸入密碼</label>
              <!-- <input type="password" id="confirmPassword" class="bg-white border border-gray-3 text-sm rounded-3xl
                focus:ring-primary focus:border-primary block w-full px-3 py-4" placeholder="請再次輸入密碼" required
                v-model="user.confirmPassword" /> -->
              <VField id="confirmPassword" name="再次輸入密碼" :type="showPassword ? 'text' : 'password'"
                class="bg-white border border-gray-3 text-sm rounded-3xl focus:ring-primary focus:border-primary block w-full px-3 py-4"
                :class="{ 'is-invalid': errors['再次輸入密碼'] }" placeholder="請再次輸入密碼" rules="required|confirmed:@密碼"
                v-model="user.confirmPassword">
              </VField>
              <ErrorMessage name="再次輸入密碼" class="text-red-600 text-sm"></ErrorMessage>
            </div>
            <div class="flex items-start mb-6">
              <div class="flex items-center h-5">
                <input id="showPassword" type="checkbox" class="w-4 h-4 border border-gray-300 text-primary rounded
                bg-gray-50 focus:ring-3 focus:ring-primary-light" @click="showPassword = !showPassword" />
              </div>
              <label for="showPassword" class="ms-2 text-sm font-medium text-gray-1">顯示密碼</label>
            </div>
            <button type="submit" class="text-white bg-gray-1 hover:bg-primary focus:ring-4
              focus:outline-none focus:ring-primary-light font-medium rounded-3xl
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
<style lang="css">
.calcHeight {
  min-height: calc(100vh - 326.55px);
}

@media(min-width:768px) {
  .calcmin-Height {
    height: calc(100vh - 390px);
  }
}
</style>
