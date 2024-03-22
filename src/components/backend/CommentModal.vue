<script setup>
import {
  defineEmits, defineProps, inject,
  onMounted, ref,
  watchEffect,
} from 'vue';
import axios from 'axios';
import { ErrorMessage, Field, Form } from 'vee-validate';
import * as yup from 'yup';
import DelModal from '@/components/backend/DelModal.vue';
import { useMessageStore } from '@/stores/message';
import { getCookie, turnDate } from '@/utils';

const props = defineProps({
  commentData: Object,
  closeModal: Function,
  openModal: Boolean,
});

const emit = defineEmits(['getComments']);

const baseUrl = import.meta.env.VITE_APP_API_URL;

const message = useMessageStore();

const editComment = ref({});
const showDel = ref(false);
const targetId = ref('');
const delContent = ref('');
const openEdit = ref(false);

const appRef = inject('appRef');

const clickOutsideModal = (event) => {
  if (event.target.dataset.modal === 'backdrop') {
    props.closeModal();
    appRef.value.style.height = 'auto';
    appRef.value.style.overflow = 'auto';
  }
};

const contentRules = yup.string().required('請輸入評論內容').min(1, '請輸入評論內容').max(100, '評論內容不得超過100字');

onMounted(() => {
  editComment.value = props.commentData;
});

const onSubmit = async (value) => {
  const token = getCookie('selectWaveToken');
  try {
    const { data } = await axios.put(`${baseUrl}/api/comment/${editComment.value.id}`, value, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data.status) {
      message.setMessage({
        message: '更新成功',
      });
      message.showToast(true);
    }
  } catch (catchError) {
    message.setMessage({
      message: `${catchError.response.data.message}`,
    });
    message.showToast(true, 'error');
  }

  props.closeModal();
};

const handleEditContent = (item) => {
  openEdit.value = item.id;
  editComment.value = { ...item };
};

const closeDelModal = () => {
  showDel.value = false;
  appRef.value.style.height = 'auto';
  appRef.value.style.overflow = 'auto';
};

function openDelModal(item) {
  showDel.value = true;
  targetId.value = item.id;
  delContent.value = `「${item.content}」`;
}

const delComment = async () => {
  const token = getCookie('selectWaveToken');
  try {
    const { data } = await axios.delete(`${baseUrl}/api/comment/${targetId.value}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data.status) {
      message.setMessage({
        message: '刪除成功',
      });
      message.showToast(true);
      showDel.value = false;
      appRef.value.style.height = 'auto';
      appRef.value.style.overflow = 'auto';
      props.closeModal();
      emit('getComments');
    }
  } catch (catchError) {
    message.setMessage({
      message: `${catchError.response.data.message}`,
    });
    message.showToast(true, 'error');
  }
  closeDelModal();
};

watchEffect(() => {
  if (props.openModal) {
    appRef.value.style.height = '100dvh';
    appRef.value.style.overflow = 'clip';
  } else {
    appRef.value.style.height = 'auto';
    appRef.value.style.overflow = 'auto';
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
            評論內容
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
        <div class="flex flex-col gap-2 p-5 md:p-8">
          <div class="relative flex justify-between pb-4 rounded-md bg-gradient-to-b from-gray-4/0 to-gray-2/50">
            <img :src="commentData[0].pollId.imageUrl" alt="poll image" class="absolute inset-0 object-cover w-full h-full opacity-35 -z-10">
            <div class="flex-shrink-0 p-4 space-y-2">
              <h1 class="text-2xl font-semibold">{{ commentData[0].pollId.title }}</h1>
              <p>{{ commentData[0].pollId.description }}</p>
            </div>
            <div class="flex justify-end w-full p-4">
              <div class="flex flex-col items-center justify-center gap-2">
                <img :src="commentData[0].pollId.createdBy.avatar" alt="poll image" class="object-cover w-16 h-16 border rounded-full border-gray-3">
                <p class="text-center">{{ commentData[0].pollId.createdBy.name }}</p>
              </div>
            </div>
          </div>
          <h2 class="pb-2 text-xl font-semibold leading-normal border-b">此投票專案中您的所有評論</h2>
          <ul class="flex flex-col gap-2 h-[50dvh] overflow-y-auto">
            <li v-for="item in commentData" :key="item.id" class="flex flex-wrap items-start justify-between p-3 mb-4 bg-gray-4 rounded-2xl md:rounded-3xl md:p-8">
            <h3 class="relative text-xl font-medium leading-normal">
              {{ item.content }}
              <span v-if="item.edited" class="absolute top-0 w-full text-sm translate-x-2 translate-y-1 left-full text-gray-2">(已編輯)</span>
            </h3>
            <div class="flex flex-col items-end gap-2">
              <button @click="handleEditContent(item)" :class="openEdit === item.id ? 'hidden' : 'block'"
              class="rounded-3xl border border-gray-1 hover:bg-primary-dark hover:border-primary-dark hover:text-white bg-white px-4 py-2.5 w-full disabled:opacity-50 disabled:bg-gray-3 disabled:text-gray-2 disabled:border-gray-3">編輯</button>
              <p class="text-sm text-gray-2">建立於: {{ turnDate(item.createdTime) }}</p>
              <p class="text-sm text-gray-2">最後更新: {{ turnDate(item.updateTime) }}</p>
            </div>
            <Form class="flex items-start w-full gap-4 py-4" v-if="openEdit === item.id" @submit="onSubmit">
              <button type="button" class="grid p-2 text-red-400 transition duration-150 bg-transparent place-content-center hover:text-red-600" @click="openDelModal(item)">
                <i class="text-3xl bi bi-x-circle"></i>
                <span class="sr-only">Remove Comment</span>
              </button>
              <div class="space-y-2">
                <Field
                              :id="item.id"
                              type="text"
                              name="content"
                              :rules="contentRules"
                              class="block w-full p-3 text-sm bg-white border rounded-full border-gray-3 focus:ring-primary focus:border-primary disabled:bg-gray-3/25 disabled:text-gray-1/50"
                              placeholder="請輸入選項內容"
                              v-model="editComment.content"
                            />
                <ErrorMessage name="content" class="pl-3 text-sm text-primary-dark" />
              </div>
              <button type="submit" class="px-4 py-3 border text-gray-1 border-gray-1 rounded-3xl hover:bg-gray-1 hover:text-white shrink-0 disabled:opacity-50 disabled:bg-gray-3 disabled:text-gray-2">更新評論</button>
              <button type="button" class="px-4 py-3 border text-gray-1 border-gray-1 rounded-3xl hover:bg-gray-1 hover:text-white shrink-0 disabled:opacity-50 disabled:bg-gray-3 disabled:text-gray-2" @click="openEdit = ''">取消</button>
            </Form>
          </li>
          </ul>
          </div>
      </div>
    </div>
  </div>
  <DelModal v-if="showDel" :openModal="showDel" @closeModal="closeDelModal" @delFunction="delComment"
  :delContent="delContent" :contentType="'評論'" />
</template>
