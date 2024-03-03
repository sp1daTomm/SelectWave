<!-- eslint-disable no-unused-vars -->
<script setup>
import { defineProps, onMounted, ref } from 'vue';
import axios from 'axios';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import {
  getCookie,
  isFileSizeValid,
  isFileTypesValid,
  turnDate,
} from '@/utils';

const maxFileSize = 1024 * 1024;
const fileTypes = ['image/png', 'image/jpg', 'image/jpeg'];

const pollValidationSchema = yup.object({
  title: yup.string().required('請輸入標題'),
  description: yup.string().required('請輸入投票說明'),
  imageUrl: yup
    .mixed()
    .test('fileSize', (value) => {
      if (!value) return true;
      return isFileSizeValid([value], maxFileSize);
    })
    .test('fileType', (value) => {
      if (!value) return true;
      return isFileTypesValid([value], fileTypes);
    }),
  tags: yup.array().of(yup.string()).max(3, '最多只能選擇三個標籤'),
  options: yup.array().of(
    yup.object().shape({
      title: yup.string().required('請輸入選項名稱'),
      imageUrl: yup
        .mixed()
        .test('fileSize', (value) => {
          if (!value) return true;
          return isFileSizeValid([value], maxFileSize);
        })
        .test('fileType', (value) => {
          if (!value) return true;
          return isFileTypesValid([value], fileTypes);
        }),
    }),
  ),
});

const props = defineProps({
  allTags: Array,
  functionType: String,
  pollData: Object,
  selectedTagsProps: Array,
  closeModal: Function,
  openModal: Boolean,
  submitFunction: Function,
});

const editPollDataModal = ref({
  title: '',
  description: '',
  imageUrl: '',
  startDate: '',
  endDate: '',
  isPrivate: false,
  options: [],
  tags: [],
});

const { errors, values } = useForm({
  initialValues: {
    ...editPollDataModal.value,
  },
  validationSchema: pollValidationSchema,
});

const fileInput = ref(null);
const fileInputOption = ref(null);
const labelInput = ref(null);
const labelTag = ref(null);

const selectedTags = ref([]);
const isPollStart = ref(false);
const startDate = ref('');
const endDate = ref('');

const isLoading = ref(false);
const apiUrl = import.meta.env.VITE_APP_API_URL;
const token = getCookie('selectWaveToken');
axios.defaults.headers.common.Authorization = token;

async function uploadImage(file) {
  const formData = new FormData();
  formData.append('upload-image', file);
  const apiPath = `${apiUrl}/api/imgur/upload`;
  const { data } = await axios.post(apiPath, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
  return data.result;
}

async function uploadCoverFile() {
  isLoading.value = true;
  const uploadFile = fileInput.value.files[0];
  const imageUrl = await uploadImage(uploadFile);
  editPollDataModal.value.imageUrl = imageUrl;
  fileInput.value = '';
  isLoading.value = false;
}
async function uploadOptionFile(index) {
  isLoading.value = true;
  const uploadFile = fileInputOption.value.files[0];
  const imageUrl = await uploadImage(uploadFile);
  editPollDataModal.value.options[index].imageUrl = imageUrl;
  fileInputOption.value = '';
  isLoading.value = false;
}
function createOption() {
  editPollDataModal.value.options.push({
    title: '',
    imageUrl: '',
  });
}
function changeTag() {
  // 標籤
  const selectedValue = labelInput.value;
  if (selectedValue) {
    if (
      !selectedTags.value.includes(selectedValue)
      && selectedTags.value.length < 3
    ) {
      // this.selectedTags.push(selectedValue);
      selectedTags.value.push(selectedValue);
      labelInput.value = '';
    }
  }
}
function handleTimeDate(date, type) {
  if (type === 'start') {
    editPollDataModal.value.startDate = turnDate(date);
  } else {
    editPollDataModal.value.endDate = turnDate(date);
  }
}

onMounted(async () => {
  editPollDataModal.value = props.pollData;
});

const onSubmit = async () => {
  isLoading.value = true;
  try {
    await props.submitFunction(values);
    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;
  }
};

const clickOutsideModal = (event) => {
  if (event.target.dataset.modal === 'backdrop') {
    props.closeModal();
  }
};

</script>

<template>
  <Transition name="fade" :duration="550">
  <div
    v-if="props.openModal" data-modal="backdrop"
    class="fixed bg-gray-1/35 backdrop-blur top-0 left-0 right-0 z-50 w-full p-4
         overflow-hidden md:inset-0 h-[calc(100%-1rem)] max-h-full"
    :class="props.openModal ? '' : 'hidden'" @click="clickOutsideModal" @keydown.esc="props.openModal && props.closeModal()"
  >
    <div id="modal" class="relative w-full max-w-2xl max-h-screen py-4 mx-auto">
      <div
        class="relative overflow-hidden -translate-y-2 bg-white shadow rounded-xl max-h-dvh md:rounded-2xl"
      >
        <div
          class="sticky top-0 z-10 flex items-center justify-between p-5 bg-white border-b"
        >
          <h3 class="text-xl font-semibold text-gray-900">
            {{ props.functionType === "新增" ? "發起投票" : "編輯投票" }}
          </h3>
          <button
            type="button"
            class="grid w-6 h-6 p-4 text-gray-400 bg-transparent rounded-lg place-content-center hover:bg-gray-200 hover:text-gray-900 ms-auto dark:hover:bg-gray-600 dark:hover:text-white"
            @click.prevent="props.closeModal()"
          >
            <i class="text-3xl bi bi-x"></i>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <form @submit="onSubmit">
          <div
            class="flex flex-col gap-4 p-5 overflow-y-auto max-h-[75dvh] md:p-5"
          >
            <div class="flex flex-wrap gap-4">
              <div class="w-full md:w-auto">
                <label
                  for="cover"
                  class="flex flex-col gap-2 text-base font-medium text-gray-1"
                >
                  {{
                    !editPollDataModal.imageUrl ? "上傳封面照" : "變更封面照"
                  }}
                  <div class="flex items-center justify-center w-full">
                    <label
                      for="dropzone-file"
                      v-if="!editPollDataModal.imageUrl"
                      class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                      <div
                        class="flex flex-col items-center justify-center pt-5 pb-6"
                      >
                        <i
                          class="mb-4 text-4xl text-gray-500 bi bi-cloud-arrow-up-fill dark:text-gray-400"
                        />
                        <p
                          class="mb-2 text-sm text-gray-500 dark:text-gray-400"
                        >
                          <span class="font-semibold">點擊選擇圖片</span>
                          或是將檔案拖拉至此
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          支援 jpg、jpeg 與 png 格式
                        </p>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        class="hidden"
                        ref="fileInput"
                        :disabled="isPollStart"
                        @change="uploadCoverFile"
                      />
                    </label>
                  </div>
                  <div class="relative group">
                    <img
                      v-if="editPollDataModal.imageUrl"
                      :src="editPollDataModal.imageUrl"
                      class="block object-cover object-center w-32 h-32 mx-auto cursor-pointer rounded-3xl md:h-64 md:w-64"
                      alt="封面照"
                    />
                    <div
                      v-if="editPollDataModal.imageUrl"
                      class="absolute inset-0 flex flex-col justify-end transition duration-150 opacity-0 cursor-pointer bg-gradient-to-b from-transparent to-gray-1 text-gray-4 hover:opacity-90"
                    >
                      <p class="py-2 mt-auto text-center">變更</p>
                    </div>
                    <input
                      type="file"
                      id="cover"
                      ref="fileInput"
                      accept="image/png, image/jpeg, image/jpg"
                      class="hidden"
                      :disabled="isPollStart"
                      @change="uploadCoverFile"
                    />
                  </div>
                </label>
                <p v-if="errors.imageUrl" class="text-red-400">
                  僅限上傳 jpg、jpeg 與 png 格式。 圖片大小不可超過 2MB
                </p>
              </div>
              <div class="flex flex-col flex-auto gap-4">
                <div class="flex flex-col gap-2">
                  <label for="title" class="text-base font-medium text-gray-1"
                    >標題<span class="text-primary">*</span></label
                  >
                  <VField
                    type="text"
                    id="title"
                    name="title"
                    class="w-full p-4 text-sm bg-white border rounded-full border-gray-3 focus:ring-primary focus:border-primary"
                    :disabled="isPollStart"
                    v-model="editPollDataModal.title"
                  />
                  <p v-if="errors.title" class="text-red-400">
                    {{ errors.title }}
                  </p>
                </div>
                <div class="flex flex-col flex-auto gap-2">
                  <label
                    for="description"
                    class="text-base font-medium text-gray-1"
                    >投票說明<span class="text-primary">*</span></label
                  >
                  <VField
                    as="textarea"
                    name="description"
                    id="description"
                    rows="6"
                    required
                    class="p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary"
                    :disabled="isPollStart"
                    placeholder="請在此寫下投票說明.."
                    v-model="editPollDataModal.description"
                  >
                  </VField>
                  <p v-if="errors.description" class="text-red-400">
                    {{ errors.description }}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <p class="mb-2 text-base font-medium text-gray-1">
                選項內容<span class="text-primary">*</span>
              </p>
              <ol
                class="px-4 space-y-2 text-sm font-medium list-decimal rounded-lg text-gray-1 marker:text-base"
              >
                <template
                  v-for="(item, index) in editPollDataModal.options"
                  :key="item.id"
                >
                  <li
                    class="w-full p-2 border-b border-gray-4 hover:bg-primary-light"
                  >
                    <div class="flex flex-wrap items-center gap-4">
                      <label
                        :for="'optionCover' + item.id"
                        class="relative w-full overflow-hidden rounded-2xl md:w-auto"
                      >
                        <img
                          :src="item.imageUrl"
                          class="object-cover object-center w-full h-24"
                        />
                        <input
                          class="hidden"
                          :id="'optionCover' + item.id"
                          :name="'optionCover' + item.id"
                          type="file"
                          ref="fileInputOption"
                          accept="image/png, image/jpeg, image/jpg"
                          :disabled="isPollStart"
                          @change="uploadOptionFile(index)"
                        />
                        <div
                          v-if="item.imageUrl"
                          class="absolute inset-0 flex flex-col justify-end transition duration-150 cursor-pointer opacity-90 md:opacity-0 bg-gradient-to-b from-transparent to-gray-1 text-gray-4 hover:opacity-90"
                        >
                          <p class="py-2 mt-auto text-center">點擊變更圖片</p>
                        </div>
                      </label>
                      <div
                        class="flex flex-col flex-auto w-full gap-2 md:items-end md:flex-row md:w-auto"
                      >
                        <div class="flex flex-col flex-auto gap-2">
                          <label
                            :for="'optionTitle' + index"
                            class="text-base font-medium text-gray-1"
                            >選項名稱<span class="text-primary">*</span></label
                          >
                          <VField
                            :id="'optionTitle' + index"
                            type="text"
                            :name="'optionTitle' + index"
                            class="block w-full p-3 text-sm bg-white border rounded-full border-gray-3 focus:ring-primary focus:border-primary"
                            :disabled="isPollStart"
                            rules="required|max:50"
                            placeholder="請輸入內容"
                            v-model="item.title"
                          />
                        </div>
                        <div
                          class="flex flex-shrink-0"
                          v-if="editPollDataModal.options.length > 1"
                        >
                          <button
                            class="px-4 py-3 mr-3 text-red-600 bg-white border border-red-600 rounded-3xl hover:bg-red-600 hover:text-white"
                            :disabled="isPollStart"
                            @click.prevent="
                              editPollDataModal.options.splice(index, 1)
                            "
                          >
                            <i class="bi bi-x-lg"></i>
                            移除選項
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                </template>
              </ol>
              <p v-if="errors.options" class="text-red-400">
                {{ errors.options }}
              </p>
              <button
                type="button"
                class="rounded-3xl border border-gray-1 hover:bg-gray-1 hover:text-white bg-white px-4 py-2.5 mt-3 w-full"
                :disabled="isPollStart"
                @click.prevent="createOption"
              >
                新增選項
              </button>
            </div>
            <div>
              <label
                for="label"
                class="block mb-2 text-base font-medium text-gray-1"
                >標籤</label
              >
              <p class="mb-2 text-sm text-gray-2">最多可新增三個標籤</p>
              <input
                id="label"
                list="label-tag"
                ref="labelInput"
                name="label"
                class="block w-full px-3 py-4 mb-6 text-sm bg-white border rounded-full border-gray-3 focus:ring-primary focus:border-primary"
                :disabled="isPollStart"
                @change="changeTag"
              />
              <datalist id="label-tag" ref="labelTag">
                <template v-for="item in allTags" :key="item">
                  <option :value="item">{{ item }}</option>
                </template>
              </datalist>
              <div
                class="flex flex-wrap space-x-1 space-y-1"
                v-if="selectedTags && selectedTags.length > 0"
              >
                <div
                  class="rounded-3xl text-gray-1 px-4 py-2.5 bg-primary-light"
                  v-for="(item, index) in selectedTags"
                  :key="index"
                >
                  <span class="mr-1 text-primary">#</span>
                  <span class="mr-1">{{ item.name }}</span>
                  <button
                    type="button"
                    class="px-1 cursor-pointer hover:text-primary-dark"
                    @click.prevent="selectedTags.splice(index, 1)"
                  >
                    <i class="bi bi-x-lg"></i>
                  </button>
                </div>
              </div>
            </div>
            <div>
              <p class="mb-2 text-base font-medium text-gray-1">投票有效日</p>
              <div
                class="flex flex-col items-center justify-between gap-4 md:flex-row"
              >
                <div class="flex flex-auto w-full">
                  <label
                    for="vote-start"
                    class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-gray-300 rounded-e-0 rounded-s-full"
                  >
                    開始日期
                  </label>
                  <VField
                    type="date"
                    id="vote-start"
                    name="vote-start"
                    :min="new Date().toISOString().split('T')[0]"
                    class="flex-1 block w-full min-w-0 px-3 py-4 text-sm text-gray-900 border border-gray-300 rounded-none rounded-e-full bg-gray-50 focus:ring-primary focus:border-primary"
                    :disabled="isPollStart"
                    v-model="startDate"
                    @input="handleTimeDate(startDate, 'start')"
                  />
                </div>
                <div class="flex flex-auto w-full">
                  <label
                    for="vote-end"
                    class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-gray-300 rounded-e-0 rounded-s-full"
                  >
                    結束日期
                  </label>
                  <VField
                    type="date"
                    id="vote-end"
                    name="vote-end"
                    :min="new Date().toISOString().split('T')[0]"
                    class="flex-1 block w-full min-w-0 px-3 py-4 text-sm text-gray-900 border border-gray-300 rounded-none rounded-e-full bg-gray-50 focus:ring-primary focus:border-primary"
                    :disabled="isPollStart"
                    v-model="endDate"
                    @input="handleTimeDate(endDate, 'end')"
                  />
                </div>
              </div>
            </div>
            <div>
              <p class="mb-2 text-base font-medium text-gray-1">投票狀態</p>
              <ul class="flex text-sm font-medium text-gray-1">
                <li class="border-gray-200">
                  <div class="flex items-center ps-3">
                    <input
                      id="open"
                      type="radio"
                      name="list-radio"
                      class="w-4 h-4 bg-gray-100 border-gray-300 text-primary focus:ring-primary-light focus:ring-2"
                      :disabled="isPollStart"
                      value="false"
                      v-model="editPollDataModal.isPrivate"
                    />
                    <label
                      for="open"
                      class="w-full py-3 text-sm font-medium ms-2"
                      >公開</label
                    >
                  </div>
                </li>
                <li class="border-gray-200">
                  <div class="flex items-center ps-3">
                    <input
                      id="hide"
                      type="radio"
                      name="list-radio"
                      class="w-4 h-4 bg-gray-100 border-gray-300 text-primary focus:ring-primary-light focus:ring-2"
                      :disabled="isPollStart"
                      value="true"
                      v-model="editPollDataModal.isPrivate"
                    />
                    <label
                      for="hide"
                      class="w-full py-3 text-sm font-medium ms-2"
                      >隱藏</label
                    >
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div
            class="sticky bottom-0 z-10 w-full p-4 bg-white border-t border-gray-4"
          >
            <div class="flex items-center justify-end w-full">
              <button
                type="submit"
                class="w-full px-6 py-3 text-base font-medium text-center text-white rounded-full md:w-auto bg-primary hover:bg-primary-dark focus:ring-4 focus:outline-none focus:ring-primary-light"
                @click.prevent="$emit('update-poll', editPollDataModal)"
              >
                儲存
              </button>
              <button
                type="button"
                class="w-full px-6 py-3 text-base font-medium text-gray-900 bg-white border border-gray-200 rounded-full md:w-auto ms-3 focus:outline-none focus:z-10 focus:ring-4 focus:ring-gray-100 hover:text-white hover:bg-gray-3"
                @click.prevent="props.closeModal()"
              >
                取消
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  </Transition>
</template>

<style scoped>

.fade-enter-active, .fade-leave-active {
  transition: all 0.25s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.fade-leave-active {
  transition-delay: 0.25s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.fade-enter-active #modal, .fade-leave-active #modal {
  transition: all 0.3s ease-in-out;
}

.fade-enter-active #modal {
  transition-delay: 0.25s;
}

.fade-enter-from #modal, .fade-leave-to #modal {
  transform: translateY(-100%);
  opacity: 0.001;
}

</style>
