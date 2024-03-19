<script setup>
import {
  computed,
  defineEmits, defineProps,
  ref, watch,
  watchEffect,
} from 'vue';
import axios from 'axios';
import * as yup from 'yup';
import { useMessageStore } from '@/stores/message';
import {
  formatImage,
  getCookie,
} from '@/utils';

const message = useMessageStore();

const validationSchema = yup.object({
  title: yup.string().required('請輸入標題'),
  description: yup.string().required('請輸入投票說明'),
  imageUrl: yup.string().url('請輸入正確的圖片網址'),
  tags: yup.array().of(yup.string()).max(3, '最多只能有三個標籤'),
  options: yup.array().of(
    yup.object().shape({
      title: yup.string().required('請輸入選項名稱'),
      imageUrl: yup.string().url('請輸入正確的圖片網址'),
    }),
  ).min(1, '至少要有一個選項'),
});

const defaultOptionImage = 'https://imgur.com/TECsq2J.png';
const defaultCoverImage = 'https://imgur.com/df933Ux.png';

function formatDate(date) {
  const d = new Date(date);
  let month = `${d.getMonth() + 1}`;
  let day = `${d.getDate()}`;
  const year = d.getFullYear();

  if (month.length < 2) month = `0${month}`;
  if (day.length < 2) day = `0${day}`;

  return [year, month, day].join('-');
}

const pollData = ref({
  title: '',
  description: '',
  imageUrl: '',
  options: [{ title: '', imageUrl: defaultOptionImage }],
  startDate: formatDate(new Date()),
  endDate: '',
  tags: [],
  isPrivate: false,
  status: 'pending',
});

const props = defineProps({
  allTags: Array,
  functionType: String,
  propsPollData: Object,
  selectedTagsProps: Array,
  openModal: Boolean,
});

const emit = defineEmits(['closeModal', 'submitFunction', 'handlePollAction']);

const formErrors = ref({});

watch(pollData, async (newVal) => {
  try {
    // 嘗試根據定義的規則驗證整個表單資料
    await validationSchema.validate(newVal, { abortEarly: false });
    // 如果驗證成功，清空錯誤訊息
    formErrors.value = {};
  } catch (err) {
    // 如果驗證失敗，處理錯誤訊息
    const errors = {};
    if (err.inner) {
      err.inner.forEach((error) => {
        if (!errors[error.path]) {
          errors[error.path] = error.message;
        }
      });
    }
    formErrors.value = errors;
  }
}, { deep: true }); // 啟用深度監聽

const fileInput = ref(null);
const fileInputOption = ref(null);
const tagInput = ref(null);
const selectedTags = ref([]);
const isLoading = ref(false);
const pollStartNow = ref(false);
const apiUrl = import.meta.env.VITE_APP_API_URL;

const token = getCookie('selectWaveToken');
axios.defaults.headers.common.Authorization = token;

async function uploadImage(file) {
  const formData = new FormData();
  formData.append('upload-image', file, 'image.png');
  const apiPath = `${apiUrl}/api/imgur/upload`;
  try {
    const { data } = await axios.post(apiPath, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    if (data.status) {
      return data.result;
    }
  } catch ({ response }) {
    message.setMessage({ message: response.data.message });
    message.showModal('error');
  }
  return false;
}

function onImageError(id) {
  if (id === 'cover') {
    pollData.value.imageUrl = defaultCoverImage;
  } else {
    const errorImageOption = pollData.value.options.find((option) => option.id === id);
    if (errorImageOption) {
      errorImageOption.imageUrl = defaultOptionImage;
    }
  }
}

async function uploadCoverFile(event) {
  isLoading.value = true;
  const uploadFile = event.target.files[0];
  const imageBlob = await formatImage(uploadFile);
  const imgurUrl = await uploadImage(imageBlob);
  pollData.value.imageUrl = imgurUrl;
  fileInput.value = '';
  isLoading.value = false;
}
async function uploadOptionFile(event, index) {
  isLoading.value = true;
  const uploadFile = event.target.files[0];
  const imageBlob = await formatImage(uploadFile);
  const imgurUrl = await uploadImage(imageBlob);
  pollData.value.options[index].imageUrl = imgurUrl;
  fileInputOption.value = '';
  isLoading.value = false;
}
function createOption() {
  pollData.value.options.push({ title: '', imageUrl: defaultOptionImage });
}
function changeTag() {
  // 標籤
  const selectedValue = tagInput.value;
  if (selectedValue && selectedValue.length > 0) {
    if (!selectedTags.value) selectedTags.value = [];
    if (!selectedTags.value.includes(selectedValue)
      && selectedTags.value.length < 3) {
      selectedTags.value.push(selectedValue);
      tagInput.value = '';
    }
  }
}

const clickOutsideModal = (event) => {
  if (event.target.dataset.modal === 'backdrop') {
    emit('closeModal');
  }
};

function handleStartPoll() {
  if (pollStartNow.value) {
    pollData.value.status = 'active';
    pollData.value.startDate = new Date().toISOString();
  } else {
    pollData.value.status = 'pending';
    pollData.value.startDate = props.propsPollData.startDate;
  }
}

function handlePollAction(action) {
  emit('handlePollAction', {
    data: pollData.value,
    type: action,
  });
}

watchEffect(() => {
  if (props.propsPollData) {
    pollData.value = { ...props.propsPollData };
    const [startDate] = props.propsPollData.startDate ? props.propsPollData.startDate.split('T')[0] : '';
    pollData.value.startDate = startDate;
    pollData.value.endDate = props.propsPollData.endDate ? props.propsPollData.endDate.split('T')[0] : '';
    pollData.value.status = props.propsPollData.status;
    selectedTags.value = props.selectedTagsProps;
  }
});

const isPollCanEdit = computed(() => {
  if (props.functionType === '新增') return true;
  if (props.propsPollData && props.propsPollData.status !== 'pending') return false;
  return true;
});

const onSubmit = async () => {
  isLoading.value = true;
  try {
    await validationSchema.validate(pollData.value, { abortEarly: false });
    formErrors.value = {};
    const formValues = {
      ...pollData.value,
      tags: selectedTags.value,
    };
    emit('submitFunction', formValues);
    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;
    if (error instanceof yup.ValidationError) {
      const errors = {};
      error.inner.forEach((err) => {
        if (!errors[err.path]) {
          errors[err.path] = err.message;
        }
      });
      formErrors.value = errors;

      message.setMessage({ message: '表單驗證失敗，請確認輸入內容' });
      message.showModal(true, 'error');
    } else {
      message.setMessage({ message: `送出表單過程發生錯誤, ${error}` });
      message.showModal(true, 'error');
    }
  }
};
</script>

<template>
  <div
    v-if="openModal" data-modal="backdrop"
    class="fixed top-0 left-0 right-0 z-50 w-full h-full max-h-screen p-4 overflow-hidden transition duration-150 bg-gray-1/35 backdrop-blur md:inset-0"
    :class="openModal ? '' : 'hidden'" @click="clickOutsideModal" @keydown.esc="openModal && emits('closeModal')"
  >
    <div id="modal" class="relative w-full max-w-2xl max-h-screen py-4 mx-auto">
      <div
        class="relative overflow-hidden -translate-y-2 bg-white shadow rounded-xl max-h-dvh md:rounded-2xl"
      >
        <div
          class="sticky top-0 z-10 flex items-center justify-between p-5 bg-white border-b"
        >
          <h3 class="text-xl font-semibold text-gray-900">
            {{ functionType === "新增" ? "發起投票" : "編輯投票" }}
          </h3>
          <button
            type="button"
            class="grid w-6 h-6 p-4 text-gray-400 transition duration-150 bg-transparent rounded-lg place-content-center hover:bg-gray-200 hover:text-gray-900 ms-auto dark:hover:bg-gray-600 dark:hover:text-white"
            @click.prevent="emit('closeModal')"
          >
            <i class="text-3xl bi bi-x"></i>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <form @submit.prevent="onSubmit">
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
                    !pollData.imageUrl ? "上傳封面照" : "變更封面照"
                  }}
                    <label
                      for="dropzone-file"
                      v-if="!pollData.imageUrl"
                      class="flex flex-col items-center justify-center w-full p-5 transition duration-150 border-2 border-gray-300 border-dashed rounded-lg h-52 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                      :class="!isPollCanEdit ? 'cursor-auto' : 'cursor-pointer hover:bg-gray-100 dark:hover:border-gray-500 dark:hover:bg-gray-600 dark:hover:bg-bray-800'"
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
                        name="dropzone-file"
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        class="hidden"
                        ref="fileInput"
                        :disabled="!isPollCanEdit || isLoading"
                        @change="uploadCoverFile"
                      />
                    </label>
                  <div class="relative group">
                    <img
                      v-if="pollData.imageUrl"
                      :src="pollData.imageUrl"
                      @error="onImageError('cover')"
                      class="block object-cover object-center w-32 h-32 mx-auto cursor-pointer rounded-3xl md:h-64 md:w-64"
                      :class="{
      'filter grayscale-[50%] opacity-50 cursor-auto': !isPollCanEdit,
      'opacity-80': pollData.status === 'closed' }"
                      alt="封面照"
                    />
                    <div
                      v-if="pollData.imageUrl && isPollCanEdit"
                      class="absolute inset-0 flex flex-col justify-end transition duration-150 opacity-0 cursor-pointer bg-gradient-to-b from-transparent to-gray-1 text-gray-4 hover:opacity-90 rounded-3xl"
                    >
                      <p class="py-2 mt-auto text-center">變更</p>
                    </div>
                    <input
                      id="cover"
                      name="dropzone-file"
                      type="file"
                      ref="fileInput"
                      accept="image/png, image/jpeg, image/jpg"
                      class="hidden"
                      :disabled="!isPollCanEdit || isLoading"
                      @change="uploadCoverFile"
                    />
                  </div>
                </label>
                <p v-if="formErrors.imageUrl" class="text-sm text-primary-dark">
                  僅限上傳 jpg、jpeg 與 png 格式。 圖片大小不可超過 2MB
                </p>
              </div>
              <div class="flex flex-col flex-auto gap-4">
                <div class="flex flex-col gap-2">
                  <label for="title" class="text-base font-medium text-gray-1"
                    >投票題目<span class="text-primary">*</span></label
                  >
                  <input
                    type="text"
                    id="title"
                    name="title"
                    class="w-full p-4 text-sm transition duration-150 bg-white border rounded-full disabled:bg-gray-3/25 disabled:text-gray-1/50 border-gray-3 focus:ring-primary focus:border-primary"
                    :class="{'disabled:text-gray-1/75': pollData.status === 'closed', 'is-invalid': formErrors.title }"
                    :disabled="!isPollCanEdit"
                    v-model="pollData.title"
                    required
                  />
                  <p v-if="formErrors.title" class="text-sm text-primary-dark">
                    {{ formErrors.title }}
                  </p>
                </div>
                <div class="flex flex-col flex-auto gap-2">
                  <label
                    for="description"
                    class="text-base font-medium text-gray-1"
                    >投票說明<span class="text-primary">*</span></label
                  >
                  <textarea
                    as="textarea"
                    name="description"
                    id="description"
                    rows="4"
                    required
                    class="p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary  disabled:bg-gray-3/25 disabled:text-gray-1/50 transition duration-150"
                    :class="{'disabled:text-gray-1/75': pollData.status === 'closed'}"
                    :disabled="!isPollCanEdit"
                    placeholder="請在此寫下投票說明.."
                    v-model="pollData.description"
                  >
                  </textarea>
                  <p v-if="formErrors.description" class="text-sm text-primary-dark">
                    {{ formErrors.description }}
                  </p>
                </div>
              </div>
            </div>
            <p class="mb-2 text-base font-medium text-gray-1">
              選項內容<span class="text-primary">*</span>
            </p>
            <div class="flex flex-col gap-4 p-4">
              <ol
                class="space-y-2 text-sm font-medium list-decimal rounded-lg text-gray-1 marker:text-base"
              >
                  <li v-for="(item, index) in pollData.options"
                  :key="index"
                    class="w-full p-2 transition duration-150 border-b rounded-3xl border-gray-4 hover:bg-primary-light"
                  >
                    <div class="flex flex-wrap items-center gap-4 md:flex-nowrap md:gap-6">
                      <label
                        :for="item.imageUrl"
                        class="relative flex-auto overflow-hidden rounded-2xl md:w-1/2"
                      >
                        <img
                          :src="item.imageUrl"
                          @error="onImageError(item.id, 'option')"
                          class="flex-auto object-cover object-center w-full mx-auto max-h-32"
                          :class="{ 'filter grayscale-[50%] opacity-50 cursor-auto': !isPollCanEdit,'opacity-80': pollData.status === 'closed' }"
                        />
                        <input
                          class="hidden"
                          :name="item.imageUrl"
                          :id="item.imageUrl"
                          type="file"
                          ref="fileInputOption"
                          accept="image/png, image/jpeg, image/jpg"
                          :disabled="!isPollCanEdit || isLoading"
                          @change="uploadOptionFile($event, index)"
                        />
                        <div
                          v-if="item.imageUrl && isPollCanEdit"
                          class="absolute inset-0 flex flex-col justify-end transition duration-150 cursor-pointer opacity-90 md:opacity-0 bg-gradient-to-b from-transparent to-gray-1/75 text-gray-4 hover:opacity-90"
                        >
                          <p class="py-2 mt-auto text-center">點擊變更圖片</p>
                        </div>
                      </label>
                      <div
                        class="flex flex-col flex-auto w-full gap-2 md:items-end md:flex-row md:w-auto"
                      >
                        <div class="flex flex-col flex-auto gap-2">
                          <label
                            :for="item.title"
                            class="text-base font-medium text-gray-1"
                            >選項名稱<span class="text-primary">*</span></label
                          >
                          <input
                            :id="item.title"
                            type="text"
                            :name="item.title"
                            class="block w-full p-3 text-sm transition duration-150 bg-white border rounded-full border-gray-3 focus:ring-primary focus:border-primary disabled:bg-gray-3/25 disabled:text-gray-1/50"
                            :class="{'disabled:text-gray-1/75': pollData.status === 'closed'}"
                            :disabled="!isPollCanEdit"
                            placeholder="請輸入選項內容"
                            v-model="item.title"
                          />
                        </div>
                        <div
                          class="flex flex-shrink-0"
                          v-if="pollData.options.length > 1"
                        >
                          <button
                            class="px-4 py-3 mr-3 text-red-600 transition duration-150 bg-white border border-red-600 rounded-3xl hover:bg-red-600 hover:text-white disabled:opacity-50 disabled:bg-gray-3 disabled:text-gray-2 disabled:border-gray-3"
                            :disabled="!isPollCanEdit"
                            @click.prevent="
                              pollData.options.splice(index, 1);
                            "
                          >
                            <i class="bi bi-x-lg"></i>
                            移除選項
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
              </ol>
              <p v-if="formErrors.options" class="text-red-400">
                {{ formErrors.options }}
              </p>
              <button
                type="button"
                class="rounded-3xl border border-gray-1 hover:bg-gray-1 hover:text-white bg-white px-4 py-2.5 mt-3 w-full  disabled:opacity-50 disabled:bg-gray-3 disabled:text-gray-2 disabled:border-gray-3 transition duration-150"
                :disabled="!isPollCanEdit || isLoading"
                @click.prevent="createOption"
              >
                新增選項
              </button>
            </div>
            <div>
              <label
                for="labelTag"
                class="block mb-2 text-base font-medium text-gray-1"
                >標籤</label
              >
              <p class="mb-2 text-sm text-gray-2">最多可新增三個標籤</p>
              <div class="flex items-center justify-between gap-4 mb-6">
                <input
                  id="labelTag"
                  name="labelTag"
                  list="label-tag"
                  v-model="tagInput"
                  class="block w-full p-4 text-sm transition duration-150 bg-white border rounded-full border-gray-3 focus:ring-primary focus:border-primary disabled:bg-gray-3/25 disabled:text-gray-1/50"
                  :disabled="!isPollCanEdit || selectedTags && selectedTags.length >= 3"
                  @keydown.enter.prevent="changeTag"
                />
                <button
                  type="button"
                  class="p-4 text-white transition duration-150 rounded-full bg-primary hover:bg-primary-dark shrink-0 disabled:opacity-50 disabled:bg-gray-3 disabled:text-gray-2"
                  :disabled="!isPollCanEdit || selectedTags && selectedTags.length >= 3 || !tagInput || isLoading"
                  @click.prevent="changeTag">
                  <i class="bi bi-plus-lg" />
                  新增標籤
                </button>
              </div>
              <datalist id="label-tag">
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
                  <span class="mr-1">{{ item.name || item }}</span>
                  <button
                    type="button"
                    class="px-1 cursor-pointer hover:text-primary-dark"
                    :disabled="!isPollCanEdit || isLoading"
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
                    for="startDate"
                    class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-gray-300 rounded-e-0 rounded-s-full"
                  >
                    開始日期
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    :min="new Date().toISOString().split('T')[0]"
                    class="flex-1 block w-full min-w-0 px-3 py-4 text-sm text-gray-900 transition duration-150 border border-gray-300 rounded-none rounded-e-full bg-gray-50 focus:ring-primary focus:border-primary disabled:bg-gray-2/25 disabled:text-gray-1/25"
                    :disabled="!isPollCanEdit || pollData.status === 'active' || isLoading"
                    v-model="pollData.startDate"
                  />
                </div>
                <div class="flex flex-auto w-full">
                  <label
                    for="endDate"
                    class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-gray-300 rounded-e-0 rounded-s-full"
                  >
                    結束日期
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    :min="new Date().toISOString().split('T')[0]"
                    class="flex-1 block w-full min-w-0 px-3 py-4 text-sm text-gray-900 transition duration-150 border border-gray-300 rounded-none rounded-e-full bg-gray-50 focus:ring-primary focus:border-primary disabled:bg-gray-2/25 disabled:text-gray-1/25"
                    :disabled="!isPollCanEdit || isLoading"
                    v-model="pollData.endDate"
                  />
                </div>
              </div>
            </div>
            <div class="flex justify-between">
              <div>
                <p class="mb-2 text-base font-medium text-center text-gray-1">顯示狀態</p>
                <ul class="flex text-sm font-medium text-gray-1">
                  <li class="border-gray-3">
                    <div class="flex items-center ps-3">
                      <input
                        id="public"
                        type="radio"
                        name="private"
                        class="w-4 h-4 bg-gray-4 border-gray-3 text-primary focus:ring-primary-light focus:ring-2 disabled:text-gray-2"
                        :disabled="!isPollCanEdit || isLoading"
                        :value="false"
                        v-model="pollData.isPrivate"
                      />
                      <label
                        for="public"
                        class="w-full py-3 text-sm font-medium ms-2"
                        >公開</label
                      >
                    </div>
                  </li>
                  <li class="border-gray-200">
                    <div class="flex items-center ps-3">
                      <input
                        id="private"
                        type="radio"
                        name="private"
                        class="w-4 h-4 bg-gray-100 border-gray-300 text-primary focus:ring-primary-light focus:ring-2"
                        :disabled="!isPollCanEdit || isLoading"
                        :value="true"
                        v-model="pollData.isPrivate"
                      />
                      <label
                        for="private"
                        class="w-full py-3 text-sm font-medium ms-2"
                        >隱藏</label
                      >
                    </div>
                  </li>
                </ul>
              </div>
              <div>
                <p class="mb-2 text-base font-medium text-center text-gray-1">投票狀態</p>
                <ul class="flex text-sm font-medium text-gray-1">
                  <li class="border-gray-3">
                    <div class="flex items-center ps-3">
                      <input
                        id="status"
                        type="checkbox"
                        name="status"
                        class="w-4 h-4 rounded bg-gray-4 border-gray-3 text-primary focus:ring-primary-light focus:ring-2 disabled:text-gray-2"
                        :disabled="!isPollCanEdit || isLoading"
                        v-model="pollStartNow"
                        @change="handleStartPoll"
                      />
                      <label
                        for="status"
                        class="w-full py-3 text-sm font-medium ms-2"
                        >立即開始</label
                      >
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div
            class="sticky bottom-0 z-10 w-full p-4 bg-white border-t border-gray-4"
          >
            <div class="flex items-center justify-between w-full">
              <div class="flex gap-2">
                <div v-if="functionType !== '新增' && pollData.status === 'active'">
                  <button type="button" class="w-full px-6 py-3 text-base font-medium text-center text-white transition duration-150 bg-black rounded-full md:w-auto hover:bg-primary hover:text-gray-1 focus:ring-4 focus:outline-none focus:ring-primary-light disabled:opacity-50 disabled:cursor-auto disabled:bg-gray-3 disabled:text-gray-2"
                  :disabled="isLoading"
                  @click="handlePollAction('end')">
                    設定: 結束投票
                  </button>
                </div>
                <div v-if="functionType !== '新增' && pollData.status === 'pending'">
                  <button type="button" class="w-full px-6 py-3 text-base font-medium text-center transition duration-150 border rounded-full border-gray-1 text-gray-1 md:w-auto hover:bg-primary hover:border-primary-dark focus:ring-4 focus:outline-none focus:ring-primary-light disabled:opacity-50 disabled:cursor-auto disabled:bg-gray-3 disabled:text-gray-2"
                  :disabled="isLoading"
                  @click="handlePollAction('start')">
                    設定: 開始投票
                  </button>
                </div>
              </div>
              <div class="flex gap-2">
                <button
                  type="submit"
                  class="w-full px-6 py-3 text-base font-medium text-center text-white transition duration-150 bg-black rounded-full md:w-auto hover:bg-primary-dark focus:ring-4 focus:outline-none focus:ring-primary-light disabled:opacity-50 disabled:cursor-auto disabled:bg-gray-3 disabled:text-gray-2"
                  :disabled="isLoading || Object.keys(formErrors).length > 0 || !isPollCanEdit"
                >
                  <i v-if="isLoading" class="bi bi-arrow-clockwise animate-spin" />
                  <i v-if="formErrors && Object.keys(formErrors).length > 0" class="bi bi-exclamation-triangle" />
                  {{ functionType === '新增' ? '創造投票' : '儲存編輯'}}
                </button>
                <button
                  type="button"
                  class="w-full px-6 py-3 text-base font-medium transition duration-150 bg-white border rounded-full text-gray-1 border-gray-3 md:w-auto ms-3 focus:outline-none focus:z-10 focus:ring-4 focus:ring-gray-4 hover:text-white hover:bg-gray-3"
                  @click.prevent="emit('closeModal')"
                  :disabled="isLoading"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
