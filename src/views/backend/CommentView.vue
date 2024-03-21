<script setup>
import { inject, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import CommentModal from '@/components/backend/CommentModal.vue';
import Pagination from '@/components/PaginationView.vue';
import { useMemberStore } from '@/stores/member';
import { useMessageStore } from '@/stores/message';
import { getCookie, turnDate } from '@/utils';

const baseUrl = import.meta.env.VITE_APP_API_URL;
const appRef = inject('appRef');

const member = useMemberStore();
const message = useMessageStore();

const router = useRouter();

const userComments = ref([]);
const memberId = ref(member.member.id);
const totalPage = ref(0);
const currentPage = ref(1);
const perPage = ref(0);
const totalMemberComments = ref(0);
const commentData = ref({});
const openCommentModal = ref(false);

const closeModal = () => {
  openCommentModal.value = false;
  appRef.value.style.height = 'auto';
  appRef.value.style.overflow = 'auto';
};

const linkToPollDetail = (id) => {
  router.push({ name: 'Voting', params: { id } });
};

const getComments = async (page = 1) => {
  const token = getCookie('selectWaveToken');
  const apiUrl = `${baseUrl}/api/comment/?createdBy=${memberId.value}&page=${page}`;
  try {
    const { data } = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    userComments.value = data.result.reduce((acc, item) => {
      if (!acc.some((result) => result.pollId.id === item.pollId.id)) {
        acc.push(item);
      }
      return acc;
    }, []);
    currentPage.value = data.page;
    perPage.value = data.limit;
    totalMemberComments.value = data.total;
    totalPage.value = Math.ceil(totalMemberComments.value / perPage.value);
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    message.setMessage({ message: errorMessage });
    message.showToast(true, 'error');
  }
};

const getPollAllComment = async (id) => {
  const token = getCookie('selectWaveToken');
  const apiUrl = `${baseUrl}/api/poll/${id}/comment/user`;
  try {
    const { data } = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    commentData.value = data.result;
    openCommentModal.value = true;
  } catch (error) {
    message.setMessage({ message: error.response.data.message });
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

onMounted(() => {
  getInitialize();
});
</script>

<template>
  <div class="container max-w-screen-lg">
    <div class="outline outline-1 outline-gray-3 rounded-2xl md:rounded-3xl
    pt-5 pb-10 md:pt-4 md:pb-16 px-3.5 md:px-5 mb-10 min-h-[45dvh]">
      <div class="flex justify-between mb-7 md:mb-8">
        <div class="relative">
          <button type="button" class="flex items-center justify-center px-6 py-3 text-base font-medium bg-white rounded-full text-gray-1 outline outline-2 outline-gray-1 hover:outline-primary hover:text-primary" @click="collapseModal.toggle()">
            篩選
          </button>
          <div class="absolute z-10 hidden font-normal bg-white divide-y shadow-lg top-14 rounded-2xl w-44 animate-fade-down animate-once animate-ease-in-out">
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
      <table class="w-full text-base text-center text-gray-1">
        <thead class="uppercase text-gray-2">
          <tr class="border-b">
            <th scope="col" class="px-6 py-3 font-medium text-left">
              投票標題
            </th>
            <th scope="col" class="hidden px-6 py-3 font-medium lg:table-cell">
              開始日期
            </th>
            <th scope="col" class="hidden px-6 py-3 font-medium lg:table-cell">
              結束日期
            </th>
            <th scope="col" class="px-6 py-3 font-medium">
              查閱評論
            </th>
            <th scope="col" class="px-6 py-3 font-medium">
              投票詳情
            </th>
          </tr>
        </thead>
        <tbody v-if="userComments.length > 0">
          <tr class="bg-white hover:bg-primary-light/35 text-gray-1" :class="userComments.length - 1 !== index && 'border-b'" v-for="(item, index) in userComments" :key="item.id">
                <th scope="row" class="px-6 py-4 font-medium text-left whitespace-nowrap lg:text-center">
                  <p class="text-left">{{ item.pollId.title }}</p>
                  <p class="block lg:hidden">開始：{{ turnDate(item.startDate) }}</p>
                  <p class="block lg:hidden">結束：{{ turnDate(item.endDate) }}</p>
                </th>
                <td class="hidden px-6 py-4 lg:table-cell">
                  {{ turnDate(item.startDate) }}
                </td>
                <td class="hidden px-6 py-4 lg:table-cell">
                  {{ turnDate(item.endDate) }}
                </td>
                <td class="hidden px-6 py-4 lg:table-cell">
                  <button type="button" class="hover:text-primary" @click="getPollAllComment(item.pollId.id)">
                    <i class="w-full p-5 text-xl bi bi-eye-fill" />
                  </button>
                </td>
                <td class="flex flex-col justify-center gap-4 px-6 py-4 lg:flex-row">
                  <button type="button"
                  class="hover:text-primary mb-3.5 lg:mb-0"
                  @click="linkToPollDetail(item.pollId.id)">
                    <i class="w-full p-5 text-2xl bi bi-link-45deg" />
                  </button>
                </td>
              </tr>
        </tbody>
      </table>
      <div v-if="userComments.length === 0" class="grid w-full h-full px-6 py-4 text-center min-h-[30dvh] place-content-center">
        <p class="text-gray-2">您沒有對任何投票有進行評論</p>
      </div>
    </div>
    <Pagination :totalPage="totalPage" :currentPage="currentPage" @updatePage="getComments" />
  </div>
  <CommentModal v-if="openCommentModal" @linkToPollDetail="linkToPollDetail" @getComments="getComments"
  :openModal="openCommentModal" :closeModal="closeModal" :commentData="commentData" />
</template>
