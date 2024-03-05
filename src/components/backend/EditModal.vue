<script setup>
import {
  computed,
  defineProps, onMounted, ref, watch,
} from 'vue';
import axios from 'axios';
import {
  Field, useField, useFieldArray, useForm,
} from 'vee-validate';
import * as yup from 'yup';
import { useMessageStore } from '@/stores/message';
import {
  formatImage,
  getCookie,
  turnDate,
} from '@/utils';

const message = useMessageStore();

const validationSchema = yup.object({
  title: yup.string().required('請輸入標題'),
  description: yup.string().required('請輸入投票說明'),
  imageUrl: yup.string().url('請輸入正確的圖片網址'),
  // tags: yup.array().of(yup.string()).max(3, '最多只能選擇三個標籤'),
  // options: yup.array().of(
  //   yup.object().shape({
  //     title: yup.string().required('請輸入選項名稱'),
  //     imageUrl: yup.string().url('請輸入正確的圖片網址'),
  //   }),
  // ).min(1, '至少要有一個選項'),
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

const { value: title } = useField('title');
const { value: description } = useField('description');
const { value: imageUrl } = useField('imageUrl');
const { value: tags } = useField('tags');
const { value: options, errorMessage: optionsError } = useField('options');
const { value: startDate } = useField('startDate');
const { value: endDate } = useField('endDate');
const { value: isPrivate } = useField('isPrivate');
const { value: status } = useField('status');

const { errors, handleSubmit, setFieldValue } = useForm({
  initialValues: {
    title: title.value || '',
    description: description.value || '',
    imageUrl: imageUrl.value || '',
    tags: tags.value || '',
    options: options.value || [],
    startDate: startDate.value || '',
    endDate: endDate.value || '',
    isPrivate: isPrivate.value || false,
    status: status.value || 'pending',
  },
  validationSchema,
});

const { push, remove } = useFieldArray('options');

const fileInput = ref(null);
const fileInputOption = ref(null);

const selectedTags = ref([]);

const isLoading = ref(false);
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

async function uploadCoverFile(event) {
  isLoading.value = true;
  const uploadFile = event.target.files[0];
  const imageBlob = await formatImage(uploadFile);
  const imgurUrl = await uploadImage(imageBlob);
  imageUrl.value = imgurUrl;
  fileInput.value = '';
  isLoading.value = false;
}
async function uploadOptionFile(event, index) {
  isLoading.value = true;
  const uploadFile = event.target.files[0];
  const imageBlob = await formatImage(uploadFile);
  const imgurUrl = await uploadImage(imageBlob);
  options[index].value.imageUrl = imgurUrl;
  fileInputOption.value = '';
  isLoading.value = false;
}
function createOption() {
  if (!options.value || options.value.length < 1) {
    options.value = [];
  }
  push({ title: '', imageUrl: 'https://imgur.com/TECsq2J.png' });
}
function changeTag() {
  // 標籤
  const selectedValue = tags.value;
  if (selectedValue && selectedValue.length > 0) {
    if (!selectedTags.value) selectedTags.value = [];
    if (!selectedTags.value.includes(selectedValue)
      && selectedTags.value.length < 3) {
      selectedTags.value.push(selectedValue);
      tags.value = '';
    }
  }
}

const clickOutsideModal = (event) => {
  if (event.target.dataset.modal === 'backdrop') {
    props.closeModal();
  }
};

function handleStartPoll() {
  if (status.value === 'active') {
    startDate.value = new Date().toISOString();
  } else {
    startDate.value = '';
  }
}

function createEmptyFormValues(data) {
  title.value = data.title || '';
  description.value = data.description || '';
  imageUrl.value = data.imageUrl || '';
  if (data.options && Array.isArray(data.options)) {
    options.value = []; // 清空数组
    data.options.forEach((item) => options.value.push(item)); // 逐项添加
  }
  // 對於日期，先檢查它們是否存在且不為undefined
  if (data.startDate && typeof data.startDate === 'string') {
    const startDateValue = data.startDate.split('T')[0]; // 或者使用您需要的任何適當處理方式
    startDate.value = startDateValue;
  } else {
    startDate.value = turnDate(new Date()); // 或設置為某個默認值
  }
  if (data.endDate && typeof data.endDate === 'string') {
    const endDateValue = data.endDate.split('T')[0]; // 同上
    endDate.value = endDateValue;
  } else {
    endDate.value = ''; // 或設置為某個默認值
  }
  isPrivate.value = data.isPrivate || false;
  status.value = data.status || 'pending';
  tags.value = data.tags || '';
}

function setFormValues(data) {
  console.log('data:', data);
  setFieldValue('title', data.title || '');
  setFieldValue('description', data.description || '');
  setFieldValue('imageUrl', data.imageUrl || '');
  if (data.options && Array.isArray(data.options)) {
    options.value = []; // 清空数组
    data.options.forEach((item) => options.value.push(item)); // 逐项添加
  }
  // 對於日期，先檢查它們是否存在且不為undefined
  if (data.startDate && typeof data.startDate === 'string') {
    const startDateValue = data.startDate.split('T')[0]; // 或者使用您需要的任何適當處理方式
    startDate.value = startDateValue;
  } else {
    startDate.value = turnDate(new Date()); // 或設置為某個默認值
  }
  if (data.endDate && typeof data.endDate === 'string') {
    const endDateValue = data.endDate.split('T')[0]; // 同上
    endDate.value = endDateValue;
  } else {
    endDate.value = ''; // 或設置為某個默認值
  }
  setFieldValue('isPrivate', data.isPrivate || false);
  setFieldValue('status', data.status || 'pending');
  setFieldValue('tags', data.tags || '');
}

onMounted(async () => {
  console.log('pollData:', props.pollData);
  if (props.functionType === '新增') {
    if (props.pollData) createEmptyFormValues(props.pollData);
  } else if (props.pollData) { setFormValues(props.pollData); }
});

watch(() => props.pollData, (newValue) => {
  setFormValues(newValue);
}, { deep: true });

const isPollCanEdit = computed(() => {
  if (props.functionType === '新增') return true;
  if (props.pollData && props.pollData.status !== 'pending') return false;
  return true;
});

const onSubmit = handleSubmit((values) => {
  console.log('Form submitted with values:', values);
  isLoading.value = true;
  try {
    const result = {
      title: values.title,
      description: values.description,
      imageUrl: values.imageUrl,
      options: values.options,
      startDate: (values.startDate && turnDate(values.startDate)) || '',
      endDate: (values.endDate && turnDate(values.endDate)) || '',
      tags: selectedTags.value,
      isPrivate: values.isPrivate,
      status: values.status,
    };
    console.log('final result:', result);
    props.submitFunction(result);
    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;
  }
});

</script>

<template>
  <div
    v-if="openModal" data-modal="backdrop"
    class="fixed bg-gray-1/35 backdrop-blur top-0 left-0 right-0 z-50 w-full p-4
        overflow-hidden md:inset-0 h-[calc(100%-1rem)] max-h-full"
    :class="openModal ? '' : 'hidden'" @click="clickOutsideModal" @keydown.esc="openModal && closeModal()"
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
            class="grid w-6 h-6 p-4 text-gray-400 bg-transparent rounded-lg place-content-center hover:bg-gray-200 hover:text-gray-900 ms-auto dark:hover:bg-gray-600 dark:hover:text-white"
            @click.prevent="closeModal()"
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
                    !imageUrl ? "上傳封面照" : "變更封面照"
                  }}
                    <label
                      for="dropzone-file"
                      v-if="!imageUrl"
                      class="flex flex-col items-center justify-center w-full p-5 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer h-52 bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
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
                      <Field
                        id="dropzone-file"
                        name="imageUrl"
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        class="hidden"
                        ref="fileInput"
                        :disabled="!isPollCanEdit"
                        v-model="imageUrl"
                        @change="uploadCoverFile"
                      />
                    </label>
                  <div class="relative group">
                    <img
                      v-if="imageUrl"
                      :src="imageUrl"
                      class="block object-cover object-center w-32 h-32 mx-auto cursor-pointer rounded-3xl md:h-64 md:w-64"
                      :class="{ 'filter grayscale-[50%] opacity-50 cursor-auto': !isPollCanEdit }"
                      alt="封面照"
                    />
                    <div
                      v-if="imageUrl && isPollCanEdit"
                      class="absolute inset-0 flex flex-col justify-end transition duration-150 opacity-0 cursor-pointer bg-gradient-to-b from-transparent to-gray-1 text-gray-4 hover:opacity-90 rounded-3xl"
                    >
                      <p class="py-2 mt-auto text-center">變更</p>
                    </div>
                    <Field
                      id="cover"
                      name="imageUrl"
                      type="file"
                      ref="fileInput"
                      accept="image/png, image/jpeg, image/jpg"
                      class="hidden"
                      :disabled="!isPollCanEdit"
                      v-model="imageUrl"
                      @change="uploadCoverFile"
                    />
                  </div>
                </label>
                <p v-if="errors.imageUrl" class="text-sm text-primary-dark">
                  僅限上傳 jpg、jpeg 與 png 格式。 圖片大小不可超過 2MB
                </p>
              </div>
              <div class="flex flex-col flex-auto gap-4">
                <div class="flex flex-col gap-2">
                  <label for="title" class="text-base font-medium text-gray-1"
                    >投票題目<span class="text-primary">*</span></label
                  >
                  <Field
                    type="text"
                    id="title"
                    name="title"
                    class="w-full p-4 text-sm bg-white border rounded-full disabled:bg-gray-3/25 disabled:text-gray-1/50 border-gray-3 focus:ring-primary focus:border-primary"
                    :class="{ 'is-invalid': errors.title }"
                    :disabled="!isPollCanEdit"
                    v-model="title"
                    required
                  />
                  <p v-if="errors.title" class="text-sm text-primary-dark">
                    {{ errors.title }}
                  </p>
                </div>
                <div class="flex flex-col flex-auto gap-2">
                  <label
                    for="description"
                    class="text-base font-medium text-gray-1"
                    >投票說明<span class="text-primary">*</span></label
                  >
                  <Field
                    as="textarea"
                    name="description"
                    id="description"
                    rows="4"
                    required
                    class="p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary  disabled:bg-gray-3/25 disabled:text-gray-1/50"
                    :disabled="!isPollCanEdit"
                    placeholder="請在此寫下投票說明.."
                    v-model="description"
                  >
                  </Field>
                  <p v-if="errors.description" class="text-sm text-primary-dark">
                    {{ errors.description }}
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
                  <li v-for="(item, index) in options"
                  :key="index"
                    class="w-full p-2 border-b border-gray-4 hover:bg-primary-light"
                  >
                    <div class="flex flex-wrap items-center gap-4">
                      <label
                        :for="item.imageUrl"
                        class="relative w-full overflow-hidden rounded-2xl md:w-auto"
                      >
                        <img
                          :src="item.imageUrl"
                          class="object-cover object-center w-full h-24"
                          :class="{ 'filter grayscale-[50%] opacity-50 cursor-auto': !isPollCanEdit }"
                        />
                        <Field
                          class="hidden"
                          :name="item.imageUrl"
                          :id="item.imageUrl"
                          type="file"
                          ref="fileInputOption"
                          accept="image/png, image/jpeg, image/jpg"
                          :disabled="!isPollCanEdit"
                          @change="uploadOptionFile(event, index)"
                        />
                        <div
                          v-if="item.imageUrl && isPollCanEdit"
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
                            :for="item.title"
                            class="text-base font-medium text-gray-1"
                            >選項名稱<span class="text-primary">*</span></label
                          >
                          <Field
                            :id="item.title"
                            type="text"
                            :name="item.title"
                            class="block w-full p-3 text-sm bg-white border rounded-full border-gray-3 focus:ring-primary focus:border-primary disabled:bg-gray-3/25 disabled:text-gray-1/50"
                            :disabled="!isPollCanEdit"
                            placeholder="請輸入選項內容"
                            v-model="item.title"
                          />
                        </div>
                        <div
                          class="flex flex-shrink-0"
                          v-if="options.length > 1"
                        >
                          <button
                            class="px-4 py-3 mr-3 text-red-600 bg-white border border-red-600 rounded-3xl hover:bg-red-600 hover:text-white disabled:opacity-50 disabled:bg-gray-3 disabled:text-gray-2 disabled:border-gray-3"
                            :disabled="!isPollCanEdit"
                            @click.prevent="
                              remove(index)
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
              <p v-if="optionsError" class="text-red-400">
                {{ optionsError }}
              </p>
              <button
                type="button"
                class="rounded-3xl border border-gray-1 hover:bg-gray-1 hover:text-white bg-white px-4 py-2.5 mt-3 w-full  disabled:opacity-50 disabled:bg-gray-3 disabled:text-gray-2 disabled:border-gray-3"
                :disabled="!isPollCanEdit"
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
                <Field
                  id="labelTag"
                  name="labelTag"
                  list="label-tag"
                  v-model="tags"
                  class="block w-full p-4 text-sm bg-white border rounded-full border-gray-3 focus:ring-primary focus:border-primary disabled:bg-gray-3/25 disabled:text-gray-1/50"
                  :disabled="!isPollCanEdit || selectedTags.length >= 3"
                  @change.prevent="changeTag"
                  @keydown.enter.prevent="changeTag"
                />
                <button
                  type="button"
                  class="p-4 text-white rounded-full bg-primary hover:bg-primary-dark shrink-0 disabled:opacity-50 disabled:bg-gray-3 disabled:text-gray-2"
                  :disabled="!isPollCanEdit || selectedTags.length >= 3 || !tags || tags.length < 1"
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
                  <Field
                    type="date"
                    id="startDate"
                    name="startDate"
                    :min="new Date().toISOString().split('T')[0]"
                    class="flex-1 block w-full min-w-0 px-3 py-4 text-sm text-gray-900 border border-gray-300 rounded-none rounded-e-full bg-gray-50 focus:ring-primary focus:border-primary disabled:bg-gray-2/25 disabled:text-gray-1/25"
                    :disabled="!isPollCanEdit || status === 'active'"
                    v-model="startDate"
                  />
                </div>
                <div class="flex flex-auto w-full">
                  <label
                    for="endDate"
                    class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-gray-300 rounded-e-0 rounded-s-full"
                  >
                    結束日期
                  </label>
                  <Field
                    type="date"
                    id="endDate"
                    name="endDate"
                    :min="new Date().toISOString().split('T')[0]"
                    class="flex-1 block w-full min-w-0 px-3 py-4 text-sm text-gray-900 border border-gray-300 rounded-none rounded-e-full bg-gray-50 focus:ring-primary focus:border-primary disabled:bg-gray-2/25 disabled:text-gray-1/25"
                    :disabled="!isPollCanEdit"
                    v-model="endDate"
                  />
                </div>
              </div>
            </div>
            <div class="flex justify-between">
              <div>
                <p class="mb-2 text-base font-medium text-center text-gray-1">顯示狀態</p>
                <ul class="flex text-sm font-medium text-gray-1">
                  <li class="border-gray-200">
                    <div class="flex items-center ps-3">
                      <Field
                        id="public"
                        type="radio"
                        name="private"
                        class="w-4 h-4 bg-gray-100 border-gray-300 text-primary focus:ring-primary-light focus:ring-2"
                        :disabled="!isPollCanEdit"
                        :value="false"
                        v-model="isPrivate"
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
                      <Field
                        id="private"
                        type="radio"
                        name="private"
                        class="w-4 h-4 bg-gray-100 border-gray-300 text-primary focus:ring-primary-light focus:ring-2"
                        :disabled="!isPollCanEdit"
                        :value="true"
                        v-model="isPrivate"
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
                  <li class="border-gray-200">
                    <div class="flex items-center ps-3">
                      <Field
                        id="status"
                        type="checkbox"
                        name="status"
                        class="w-4 h-4 bg-gray-100 border-gray-300 text-primary focus:ring-primary-light focus:ring-2"
                        :disabled="!isPollCanEdit"
                        :value="'active'"
                        v-model="status"
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
            <div class="flex items-center justify-end w-full">
              <button
                type="submit"
                class="w-full px-6 py-3 text-base font-medium text-center text-white rounded-full md:w-auto bg-primary hover:bg-primary-dark focus:ring-4 focus:outline-none focus:ring-primary-light disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-3 disabled:text-gray-2"
                :disabled="isLoading"
              >
                {{ functionType === '新增' ? '創造投票' : '儲存編輯'}}
              </button>
              <button
                type="button"
                class="w-full px-6 py-3 text-base font-medium text-gray-900 bg-white border border-gray-200 rounded-full md:w-auto ms-3 focus:outline-none focus:z-10 focus:ring-4 focus:ring-gray-100 hover:text-white hover:bg-gray-3"
                @click.prevent="closeModal()"
              >
                取消
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
