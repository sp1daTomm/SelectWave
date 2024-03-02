<template>
  <div ref="flowbiteModal" tabindex="-1"
      class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center
      items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
      <div class="relative p-4 w-full max-w-md max-h-full">
        <!-- Modal content -->
      <div class="relative bg-white rounded-2xl shadow">
        <!-- Modal header -->
        <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t-2xl bg-white sticky top-0">
          <h3 class="text-xl font-semibold text-gray-900">
            重設密碼
          </h3>
          <button type="button"
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            @click.prevent="cancelModal">
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <!-- Modal body -->
        <div class="p-4 md:p-5 space-y-4">
          <!-- 投票內容 -->
          <!-- <form>
            <div class="mb-4">
              <label for="title" class="block mb-2 text-base font-medium text-gray-1">新密碼</label>
              <input type="text" id="title"
                class="bg-white border border-gray-3 text-sm rounded-full focus:ring-primary focus:border-primary block w-full px-3 py-4">
            </div>
            <div class="mb-4">
              <label for="title" class="block mb-2 text-base font-medium text-gray-1">確認新密碼</label>
              <input type="text" id="title"
                class="bg-white border border-gray-3 text-sm rounded-full focus:ring-primary focus:border-primary block w-full px-3 py-4">
            </div>
          </form> -->
          <VForm v-slot="{ errors }" class="min-w-96 mx-auto">
            <div class="mb-4">
              <label for="password" class="block mb-2 text-base font-medium text-gray-1">新密碼</label>
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
            <div class="flex items-start mb-6">
              <div class="flex items-center h-5">
                <input id="showPassword" type="checkbox" class="w-4 h-4 border border-gray-300 text-primary rounded
                bg-gray-50 focus:ring-3 focus:ring-primary-light" @click="showPassword = !showPassword" />
              </div>
              <label for="showPassword" class="ms-2 text-sm font-medium text-gray-1">顯示密碼</label>
            </div>
          </VForm>
        </div>
        <!-- Modal footer -->
        <div class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b-2xl bottom-0 bg-white sticky">
          <button type="button"
            class="text-white bg-primary hover:bg-primary-dark focus:ring-4 focus:outline-none focus:ring-primary-light font-medium rounded-full text-base px-6 py-3 text-center">
            確認更改
          </button>
          <button type="button"
            class="px-6 py-3 ms-3 text-base font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 focus:z-10 focus:ring-4 focus:ring-gray-100 hover:text-white hover:bg-gray-3"
            @click.prevent="cancelModal">取消</button>
        </div>
      </div>
      </div>
    </div>
</template>
<script>
import ModalMixin from '@/mixins/ModalMixin';

export default {
  mixins: [ModalMixin],
  // props: ['delContent'],
  data() {
    return {
      modal: null,
      user: {
        password: '',
        confirmPassword: '',
      },
      showPassword: false,
    };
  },
  methods: {
    cancelModal() {
      this.user = {
        password: '',
        confirmPassword: '',
      };
      this.modal.hide();
    },
  },
};
</script>
