<template>
  <div ref="flowbiteModal" tabindex="-1"
      class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center
      items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
      <div class="relative p-4 w-full max-w-md max-h-full">
        <div class="relative bg-white rounded-2xl shadow">
          <button type="button"
            class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-red-200
            hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center
            items-center" @click.prevent="modal.hide()">
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
              stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
          <div class="p-4 md:p-5 text-center">
            <svg class="mx-auto mb-4 text-red-600 w-12 h-12
            dark:text-gray-200" aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
              stroke-width="2"
                d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <h3 class="mb-5 text-lg font-normal text-gray-01 dark:text-gray-400">
              刪除{{ delContent }}<br />
              確定要刪除 ?
            </h3>
            <button type="button"
              class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none
              focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-3xl text-sm inline-flex
              items-center px-6 py-3 text-center me-2">
              確定刪除
            </button>
            <button type="button" ref="flowbiteModal"
              class="text-gray-500 bg-white hover:bg-gray-02 focus:ring-4 focus:outline-none
              focus:ring-gray-02 rounded-3xl border border-gray-02 text-base font-medium px-6 py-3
              hover:text-white hover:bg-gray-3 focus:z-10" @click.prevent="modal.hide()">取消</button>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
import ModalMixin from '@/mixins/ModalMixin';

export default {
  mixins: [ModalMixin],
  props: ['delContent'],
  data() {
    return {
      modal: null,
    };
  },
};
</script>
