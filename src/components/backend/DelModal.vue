<script setup>
import { defineEmits, defineProps } from 'vue';

defineProps({
  openModal: Boolean,
  delContent: String,
  contentType: String,
});

const emit = defineEmits(['closeModal', 'delFunction']);

const clickOutsideModal = (event) => {
  if (event.target.dataset.modal === 'backdrop') {
    emit('closeModal');
  }
};

</script>

<template>
  <Transition name="fade" :duration="550">
  <div v-if="openModal" :class="openModal ? 'block' : 'hidden'"
      class="overflow-hidden fixed z-50 justify-center bg-gray-1/35 backdrop-blur
      items-center w-full inset-0 h-[calc(100%-1rem)] max-h-full">
      <div class="relative grid w-full h-full p-4 place-content-center" data-modal="backdrop" @click="clickOutsideModal">
        <div class="relative bg-white shadow rounded-2xl">
          <button type="button"
            class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-red-200
            hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center
            items-center" @click.prevent="emit('closeModal')">
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
              stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
          <div class="flex flex-col gap-2 p-5 text-center md:p-8">
            <div class="mb-4 space-y-4">
              <i class="text-5xl text-center text-red-600 bi bi-exclamation-circle dark:text-gray-200" />
              <h3 class="mb-5 text-lg font-normal text-gray-01 dark:text-gray-400">
                刪除<span class="text-red-500">{{ delContent }}</span>這個{{ contentType }}<br />
                確定要刪除 ?
              </h3>
            </div>
            <button type="button"
              class="px-6 py-3 text-sm font-medium text-center text-white transition duration-150 bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 rounded-3xl" @click="emit('delFunction')">
              確定刪除
            </button>
            <button type="button"
              class="px-6 py-3 text-base font-medium text-red-500 transition duration-150 bg-white border border-red-500 hover:bg-gray-02 focus:ring-4 focus:outline-none focus:ring-gray-02 rounded-3xl border-gray-02 hover:text-gray-1 hover:border-gray-2 hover:bg-gray-3 focus:z-10" @click.prevent="emit('closeModal')">取消</button>
          </div>
        </div>
      </div>
    </div>
    </Transition>
</template>
