<!-- eslint-disable no-unused-vars -->
<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import DelModal from '@/components/backend/DelModal.vue';
import Pagination from '@/components/PaginationView.vue';
import { useMemberStore } from '@/stores/member';
import { useMessageStore } from '@/stores/message';
import { getCookie, turnDate } from '@/utils';

const baseUrl = import.meta.env.VITE_APP_API_URL;

const member = useMemberStore();
const message = useMessageStore();

const router = useRouter();

const userComments = ref([]);
const memberId = ref(member.member.id);
const totalPage = ref('');
const currentPage = ref('');
const targetId = ref('');
const delContent = ref('');
const showDel = ref(false);

const closeDelModal = () => {
  showDel.value = false;
};

const getComments = async (page = 1) => {
  const token = getCookie('selectWaveToken');
  const { data } = await axios.get(`${baseUrl}/api/comment?createdBy=${memberId.value}&page=${page}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (data.status) {
    userComments.value = data.result;
    console.log('userComments', userComments.value);
  } else {
    message.setMessage({ message: data.message });
    message.showToast(true, 'error');
  }
};

async function getInitialize() {
  const verify = await member.verifyToken();
  if (verify.status) {
    const { id } = verify.result;
    memberId.value = id;
    await getComments();
  } else {
    message.setMessage({
      message: '登入失敗，請重新登入',
    });
    message.showToast(true, 'error');
    router.push('/login');
  }
}

const openPollDetail = (id) => {
  router.push({ name: 'PollDetail', params: { id } });
};

function openDelModal(item) {
  showDel.value = true;
  targetId.value = item.id;
  delContent.value = `「${item.content}」`;
}

const delComment = async () => {
  const token = getCookie('selectWaveToken');
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  try {
    const { data } = await axios.delete(`${apiUrl}/api/comment/${targetId.value}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data.status) {
      getComments();
      message.setMessage({
        message: '刪除成功',
      });
      message.showToast(true);
    }
  } catch (error) {
    message.setMessage({
      message: `${error.response.data.message}`,
    });
    message.showToast(true, 'error');
  }
  closeDelModal();
};

onMounted(() => {
  getInitialize();
});
</script>

<template>
  <div class="max-w-screen-lg px-3 mx-auto">
    <div class="outline outline-1 outline-gray-3 rounded-2xl md:rounded-3xl
    pt-5 pb-10 md:pt-4 md:pb-16 px-3.5 md:px-5 mb-10">
      <div class="flex justify-between mb-7 md:mb-8">
        <div class="relative">
          <button type="button" class="flex items-center justify-center px-6 py-3 text-base font-medium bg-white rounded-full text-gray-1 outline outline-2 outline-gray-1 hover:outline-primary hover:text-primary" @click="collapseModal.toggle()">
            篩選
          </button>
          <!-- Dropdown menu 篩選 -->
          <div ref="flowbiteCollapse"
            class="absolute z-10 hidden font-normal bg-white divide-y shadow-lg top-14 rounded-2xl w-44 animate-fade-down animate-once animate-ease-in-out">
            <ul class="py-3 text-sm text-gray-700">
              <li>
                <a href="#" class="block py-2 px-7 hover:bg-gray-100">所有投票</a>
              </li>
              <li>
                <a href="#" class="block py-2 px-7 hover:bg-gray-100">投票狀態：隱藏</a>
              </li>
              <li>
                <a href="#" class="block py-2 px-7 hover:bg-gray-100">投票狀態：公開</a>
              </li>
              <li>
                <a href="#" class="block py-2 px-7 hover:bg-gray-100">投票進行中</a>
              </li>
              <li>
                <a href="#" class="block py-2 px-7 hover:bg-gray-100">投票已結束</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- table -->
      <table class="w-full text-base text-center text-gray-1">
        <thead class="uppercase text-gray-2">
          <tr class="border-b">
            <th scope="col" class="px-6 py-3 font-medium text-left">
              投票標題
            </th>
            <th scope="col" class="px-6 py-3 font-medium">
              討論人數
            </th>
            <th scope="col" class="hidden px-6 py-3 font-medium lg:table-cell">
              開始日期
            </th>
            <th scope="col" class="hidden px-6 py-3 font-medium lg:table-cell">
              結束日期
            </th>
            <th scope="col" class="px-6 py-3 font-medium">
              查閱
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="bg-white hover:bg-primary-light" :class="userComments.length - 1 !== index && 'border-b'" v-for="(item, index) in userComments" :key="item.id">
                <th scope="row" class="px-6 py-4 font-medium text-left text-gray-900 whitespace-nowrap lg:text-center">
                  <p class="text-left">{{ item.pollId.title }}</p>
                  <p class="block lg:hidden">人數：{{ item.pollId.comments.length }}</p>
                  <p class="block lg:hidden">開始：{{ turnDate(item.startDate) }}</p>
                  <p class="block lg:hidden">結束：{{ turnDate(item.endDate) }}</p>
                </th>
                <td class="hidden px-6 py-4 lg:table-cell">
                  {{ item.pollId.comments.length }}
                </td>
                <td class="hidden px-6 py-4 lg:table-cell">
                  {{ turnDate(item.startDate) }}
                </td>
                <td class="hidden px-6 py-4 lg:table-cell">
                  {{ turnDate(item.endDate) }}
                </td>
                <td class="hidden px-6 py-4 lg:table-cell">
                  <button type="button" class="hover:text-primary" @click="openPollDetail(item.id)">
                    <i class="w-full p-5 text-xl bi bi-eye-fill" />
                  </button>
                </td>
                <td class="flex flex-col justify-center gap-4 px-6 py-4 lg:justify-between lg:flex-row">
                  <button type="button"
                  class="hover:text-primary mb-3.5 lg:mb-0"
                  @click="openDelModal(item)">
                    <i class="w-full p-5 text-xl bi bi-trash3" />
                  </button>
                </td>
              </tr>
        </tbody>
      </table>
    </div>
    <Pagination :totalPage="totalPage" :currentPage="currentPage" @updatePage="getComments" />
  </div>
  <DelModal v-if="showDel" :openModal="showDel" :closeModal="closeDelModal" :delPoll="delComment"
  :delContent="delContent" :contentType="'評論'" />
</template>
