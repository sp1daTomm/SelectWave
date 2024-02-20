<template>
  <div ref="flowbiteModal" tabindex="-1" aria-hidden="true"
    class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50
    justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-md max-h-full">
      <!-- Modal content -->
      <div class="relative bg-white rounded-2xl shadow border border-primary">
        <!-- Modal header -->
        <div class="flex items-center justify-between p-4 md:p-5 border-b border-primary rounded-t">
          <h3 class="text-xl font-semibold text-primary">
            分享投票網址
          </h3>
          <button type="button"
            class="end-2.5 text-primary bg-transparent hover:bg-primary-light hover:text-gray-900
            rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
            @click.prevent="modal.hide()">
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
              stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <!-- Modal body -->
        <div class="p-4 md:p-5">
          <p class="pb-4 text-center" ref="shareUrl">http://www.shengee.com.s/XXX</p>
          <button type="submit"
            class="w-full text-white bg-primary hover:bg-primary-dark focus:ring-4
            focus:outline-none focus:ring-blue-300 font-medium rounded-3xl text-base
            px-5 py-2.5 text-center"
            @click="copyUrl">
            複製
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ModalMixin from '@/mixins/ModalMixin';

export default {
  mixins: [ModalMixin],
  data() {
    return {
      modal: null,
    };
  },
  methods: {
    copyUrl() {
      navigator.clipboard.writeText(this.$refs.shareUrl.innerText);
      this.modal.hide();
      this.$swal({
        title: '複製成功',
      });
    },
  },
};
</script>
