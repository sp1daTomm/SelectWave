<script setup>
import { defineEmits, defineProps, ref } from 'vue';
import { useMessageStore } from '@/stores/message';

const props = defineProps({
  openModal: Boolean,
  id: String,
});

const emits = defineEmits(['closeModal']);

const message = useMessageStore();

const Url = ref(`${window.location.href.split('#')[0]}#/vote/${props.id}`);

const copyUrl = () => {
  if (navigator.clipboard && window.isSecureContext) {
    // navigator.clipboard API 需要在安全上下文中（如HTTPS）
    navigator.clipboard.writeText(Url.value)
      .then(() => {
        message.setMessage({
          message: '複製成功',
        });
        message.showToast(true);
        setTimeout(() => {
          message.closeModel();
          emits('closeModal');
        }, 2000);
      })
      .catch(() => {
        message.setMessage({
          message: '複製失敗',
        });
        message.showToast(true, 'error');
      });
  }
};
const clickOutsideModal = (event) => {
  if (event.target.dataset.modal === 'backdrop') {
    emits('closeModal');
  }
};
</script>

<template>
  <div :class="`${openModal ? 'block' : 'hidden'}`"
    class="overflow-hidden fixed inset-0 z-50 bg-gray-1/35 backdrop-blur
    justify-center items-center w-full h-[calc(100%-1rem)] max-h-full">
    <div class="relative grid w-full h-full p-4 my-auto place-content-center" @click="clickOutsideModal" data-modal="backdrop">
      <div class="relative bg-white border shadow rounded-2xl border-primary">
        <div class="flex items-center justify-between p-4 border-b rounded-t md:p-5 border-primary">
          <h3 class="text-xl font-semibold text-primary">
            分享投票網址
          </h3>
          <button type="button"
            class="end-2.5 text-primary bg-transparent hover:bg-primary-light hover:text-gray-900
            rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
            @click.prevent="emits('closeModal')">
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
              stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <div class="p-4 md:p-5">
          <p class="pb-4 text-center">{{ Url }}</p>
          <button type="submit"
            class="w-full text-white bg-primary hover:bg-primary-dark focus:ring-4
            focus:outline-none focus:ring-primary-light font-medium rounded-3xl text-base
            px-5 py-2.5 text-center"
            @click="copyUrl">
            複製
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
