<template>
  <!-- Main modal -->
  <div ref="flowbiteModal"
    class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-2xl max-h-full">
      <!-- Modal content -->
      <div class="relative bg-white rounded-2xl shadow">
        <!-- Modal header -->
        <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t-2xl bg-white sticky top-0">
          <h3 class="text-xl font-semibold text-gray-900">
            編輯投票
          </h3>
          <button type="button"
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            @click.prevent="modal.hide()">
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
          <form>
            <div class="mb-4">
              <label for="title" class="block mb-2 text-base font-medium text-gray-1">標題*</label>
              <input type="text" id="title"
                class="bg-white border border-gray-3 text-sm rounded-full focus:ring-primary focus:border-primary block w-full px-3 py-4"
                v-model="editPollDataModal.title">
            </div>
            <div class="mb-4">
              <p class="mb-2 text-base font-medium text-gray-1">選項內容*</p>
              <ol class="text-sm font-medium text-gray-1 rounded-lg list-decimal px-4 marker:text-base">
                <template v-for="(item, index) in optionsData" :key="index">
                  <li class="w-full border-b border-gray-4 p-2 hover:bg-primary-light">
                    <div class="flex flex-wrap space-y-2">
                      <div class="basis-full">
                        <img :src="item.imageUrl" class="rounded-2xl object-cover object-center"
                          style="width: 100px; height: 100px;">
                      </div>
                      <div class="basis-full">
                        <div class="flex flex-col mb-2">
                          <input
                            class="block mb-2 w-full text-sm text-gray-900 border border-gray-300 rounded-full cursor-pointer bg-gray-50 focus:outline-none"
                            id="cover" type="file" ref="fileInputOption" @change="uploadFile(index)">
                          <input type="text"
                            class="bg-white border border-gray-3 text-sm rounded-full focus:ring-primary focus:border-primary block w-full p-2.5"
                            placeholder="請輸入內容" v-model="item.title">
                        </div>
                        <div class="flex" v-if="optionsData.length > 1">
                          <button
                            class="rounded-3xl border border-red-600 text-red-600 hover:bg-red-600 hover:text-white bg-white px-4 py-2.5 mr-3"
                            @click.prevent="editPollDataModal.options.splice(index, 1)">
                            移除
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                </template>
                <button type="button"
                  class="rounded-3xl border border-gray-1 hover:bg-gray-1 hover:text-white bg-white px-4 py-2.5 mt-3 w-full"
                  @click.prevent="createOption">
                  新增選項
                </button>
              </ol>
            </div>
            <div class="mb-4">
              <label for="label" class="block mb-2 text-base font-medium text-gray-1">標籤</label>
              <p class="mb-2 text-sm text-gray-2">最多可新增三個標籤</p>
              <input id="label" list="label-tag" ref="labelInput"
                class="bg-white border border-gray-3 text-sm rounded-full focus:ring-primary focus:border-primary block w-full px-3 py-4 mb-6"
                @change="changeTag">
              <datalist id="label-tag" ref="labelTag">
                <template v-for="item in allTags" :key="item">
                  <option :value="item">{{ item }}</option>
                </template>
              </datalist>
              <!-- 顯示所選標籤 -->
              <div class="flex flex-wrap space-x-1 space-y-1">
                <div class="rounded-3xl text-gray-1 px-4 py-2.5 bg-primary-light" v-for="(item, index) in selectedTags"
                  :key="index">
                  <span class="text-primary mr-1">#</span>
                  <span class="mr-1">{{ item.name }}</span>
                  <a class="cursor-pointer hover:text-primary-dark px-1" @click.prevent="selectedTags.splice(index, 1)">
                    <i class="bi bi-x-lg"></i>
                  </a>
                </div>
              </div>
              <!-- 顯示所選標籤 -->
            </div>
            <div class="mb-4">
              <label for="cover" class="block mb-2 text-base font-medium text-gray-1">上傳封面照</label>
              <input
                class="block mb-2 w-full text-base text-gray-900 border border-gray-300 rounded-full cursor-pointer bg-gray-50 focus:outline-none"
                id="cover" type="file" ref="fileInput" @change="uploadCoverFile">
              <img :src="editPollDataModal.imageUrl" class="rounded-3xl object-cover object-center" alt="封面照"
                style="width: 150px; height: 150px;">
            </div>
            <div class="mb-4">
              <label for="message" class="block mb-2 text-base font-medium text-gray-1">投票說明*</label>
              <textarea id="message" rows="4"
                class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary"
                placeholder="請在此寫下投票說明.." v-model="editPollDataModal.description">
              </textarea>
            </div>
            <div class="mb-4">
              <p class="mb-2 text-base font-medium text-gray-1">投票有效日</p>
            </div>
            <div class="mb-4">
              <div class="flex mb-2">
                <span
                  class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 rounded-s-full">
                  開始日期
                </span>
                <input type="date" id="vote-start"
                  class="rounded-none rounded-e-full bg-gray-50 border text-gray-900 focus:ring-primary focus:border-primary block flex-1 min-w-0 w-full text-sm border-gray-300 px-3 py-4"
                  v-model="startDate" @input="clickStartDate">
              </div>
              <div class="flex">
                <span
                  class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 rounded-s-full">
                  結束日期
                </span>
                <input type="date" id="vote-end"
                  class="rounded-none rounded-e-full bg-gray-50 border text-gray-900 focus:ring-primary focus:border-primary block flex-1 min-w-0 w-full text-sm border-gray-300 px-3 py-4"
                  v-model="endDate" @input="clickEndDate">
              </div>
            </div>
            <div class="mb-4">
              <p class="mb-2 text-base font-medium text-gray-1">投票狀態</p>
              <ul class="text-sm font-medium text-gray-1 flex">
                <li class="border-gray-200">
                  <div class="flex items-center ps-3">
                    <input id="open" type="radio" name="list-radio"
                      class="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary-light focus:ring-2"
                      value="true" v-model="editPollDataModal.isPrivate">
                    <label for="open" class="w-full py-3 ms-2 text-sm font-medium">公開</label>
                  </div>
                </li>
                <li class="border-gray-200">
                  <div class="flex items-center ps-3">
                    <input id="hide" type="radio" name="list-radio"
                      class="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary-light focus:ring-2"
                      value="false" v-model="editPollDataModal.isPrivate">
                    <label for="hide" class="w-full py-3 ms-2 text-sm font-medium">隱藏</label>
                  </div>
                </li>
              </ul>
            </div>
          </form>
        </div>
        <!-- Modal footer -->
        <div class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b-2xl bottom-0 bg-white sticky">
          <button type="button"
            class="text-white bg-primary hover:bg-primary-dark focus:ring-4 focus:outline-none focus:ring-primary-light font-medium rounded-full text-base px-6 py-3 text-center"
            @click.prevent="$emit('update-poll', editPollDataModal)">
            儲存
          </button>
          <button type="button"
            class="px-6 py-3 ms-3 text-base font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 focus:z-10 focus:ring-4 focus:ring-gray-100 hover:text-white hover:bg-gray-3"
            @click.prevent="modal.hide()">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'pinia';
import ModalMixin from '@/mixins/ModalMixin';
import dateStore from '@/stores/date';

export default {
  emits: ['update-poll'],
  mixins: [ModalMixin],
  props: ['editPollData', 'allTags', 'optionsData', 'selectedTagsProps'],
  data() {
    return {
      modal: null,
      editPollDataModal: {},
      optionsDataModal: [],
      selectedTags: [],
      startDate: '', // 換算格式用:開始日期 格式"2024-02-26"
      endDate: '', // 換算格式用:結束日期
    };
  },
  methods: {
    ...mapActions(dateStore, ['turnDate']),
    uploadCoverFile() {
      // 投票票券封面
      const uploadFile = this.$refs.fileInput.files[0];
      const formData = new FormData();
      formData.append('file-to-upload', uploadFile);
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)selectWaveToken\s*=\s*([^;]*).*$)|^.*$/,
        '$1',
      );
      this.$http.defaults.headers.common.Authorization = token;
      const authToken = {
        headers: {
          Authorization: token,
        },
      };
      const api = `${import.meta.env.VITE_APP_API_URL}/api/imgur/upload`;
      this.$http.post(api, formData, authToken)
        .then((res) => {
          console.log(res);
          this.editPollDataModal.imageUrl = res.data.result;
          this.$refs.fileInput.value = '';
        })
        .catch((err) => {
          this.$swal({
            title: `${err.response.data.message}`,
          });
        });
    },
    uploadFile(index) {
      // 選項內容圖片
      const uploadFile = this.$refs.fileInputOption[index].files[0];
      const formData = new FormData();
      formData.append('file-to-upload', uploadFile);

      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)selectWaveToken\s*=\s*([^;]*).*$)|^.*$/,
        '$1',
      );
      this.$http.defaults.headers.common.Authorization = token;
      const authToken = {
        headers: {
          Authorization: token,
        },
      };

      const api = `${import.meta.env.VITE_APP_API_URL}/api/imgur/upload`;
      this.$http.post(api, formData, authToken)
        .then((res) => {
          this.editPollDataModal.options[index].imageUrl = res.data.result;
          this.$refs.fileInputOption[index].value = '';
        })
        .catch((err) => {
          this.$swal({
            title: `${err.response.data.message}`,
          });
        });
    },
    createOption() {
      // 新增選項內容欄位
      this.editPollDataModal.options.push(
        {
          title: '',
          imageUrl: 'https://imgur.com/TECsq2J.png',
        },
      );
    },
    changeTag() {
      // 標籤
      const selectedValue = this.$refs.labelInput.value;
      if (selectedValue) {
        if (!this.selectedTags) {
          this.selectedTags = [];
        }
        if (!this.selectedTags.includes(selectedValue) && this.selectedTags.length < 3) {
          // this.selectedTags.push(selectedValue);
          this.selectedTags.push({
            name: selectedValue,
            id: '',
          });
          console.log('selectedValue:', selectedValue, 'this.selectedTags:', this.selectedTags);
          this.$refs.labelInput.value = '';
        }
      }
    },
    clickEndDate() {
      // ===== 處理結束日期
      // 選取的日期轉為 YYYY-MM-DDTHH:mm:ss.sssZ
      if (this.endDate) {
        const selectedDateTime = new Date(this.endDate);
        const isoDateString = selectedDateTime.toISOString();
        this.editPollDataModal.endDate = `${isoDateString.slice(0, 23)}Z`;
      }
    },
    clickStartDate() {
      // ===== 處理結束日期
      // 選取的日期轉為 YYYY-MM-DDTHH:mm:ss.sssZ
      if (this.startDate) {
        const selectedDateTime = new Date(this.startDate);
        const isoDateString = selectedDateTime.toISOString();
        this.editPollDataModal.startDate = `${isoDateString.slice(0, 23)}Z`;
      }
    },
  },
  watch: {
    editPollData: {
      handler() {
        this.editPollDataModal = this.editPollData;
        this.optionsDataModal = this.optionsData;
        this.selectedTags = this.selectedTagsProps;
        // this.editPollDataModal.tags.push(this.selectedTags);
        [this.startDate] = this.editPollDataModal.startDate.split('T');
        [this.endDate] = this.editPollDataModal.endDate.split('T');
      },
      deep: true,
    },
  },
  mounted() {
  },
};
</script>
