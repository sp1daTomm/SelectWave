<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import ConformModal from '@/components/backend/ConformModal.vue';
import DelModal from '@/components/backend/DelModal.vue';
import PollModal from '@/components/backend/PollModal.vue';
import ShareModal from '@/components/backend/ShareModal.vue';
import Pagination from '@/components/PaginationView.vue';
import { useMemberStore } from '@/stores/member';
import { useMessageStore } from '@/stores/message';
import { getCookie, turnDate } from '@/utils';

const baseUrl = import.meta.env.VITE_APP_API_URL;

const member = useMemberStore();
const message = useMessageStore();

const router = useRouter();

const showCollapse = ref(false);
const toggleCollapse = () => {
  showCollapse.value = !showCollapse.value;
};

const showModal = ref('');

const functionType = ref('新增');
const memberId = ref('');
const totalPage = ref(0);
const currentPage = ref(1);
const targetId = ref('');

const pollActionType = ref('');
const pollActionTarget = ref('');

const delContent = ref('');
const conformContent = ref('');
const memberPolls = ref([]); // member投票資料
const resultPolls = ref([]);
const pollData = ref({
  title: '',
  description: '',
  imageUrl: 'https://i.imgur.com/df933Ux.png',
  tags: [],
  startDate: '',
  endDate: '',
  isPrivate: false,
  options: [],
  status: 'pending',
});

const allTags = ref([]);
const startDate = ref('');
const totalMemberPolls = ref(0);
const perPage = ref(0);

const openModal = ref(false);
const closeModal = () => {
  showModal.value = '';
  pollData.value = {
    title: '',
    description: '',
    imageUrl: 'https://i.imgur.com/df933Ux.png',
    tags: [],
    startDate: '',
    endDate: '',
    isPrivate: false,
    options: [],
    status: 'pending',
  };
  console.log('closeModal', pollData.value);
  console.log('closeModal', openModal.value);
};

async function getMemberPolls(page = 1) {
  const apiUrl = `${baseUrl}/api/poll?createdBy=${memberId.value}&page=${page}`;
  try {
    const { data } = await axios.get(apiUrl);
    console.log('getMemberPolls', data);
    memberPolls.value = data;
    totalMemberPolls.value = data.total;
    // 頁碼
    currentPage.value = data.page;
    perPage.value = data.limit;
    totalPage.value = Math.ceil(totalMemberPolls.value / perPage.value);
  } catch (err) {
    message.setMessage({
      message: err.response.data.message,
    });
    message.showToast(true, 'error');
  }
}

async function getTags() {
  const apiUrl = `${baseUrl}/api/tag`;
  try {
    const { data } = await axios.get(apiUrl);
    console.log('所有標籤', data.result);
    allTags.value = data.result.flatMap((poll) => poll.name);
  } catch (err) {
    console.log(err);
  }
}

async function getInitialize() {
  const verify = await member.verifyToken();
  console.log('verify', verify);
  if (verify.status) {
    const { id } = verify.result;
    memberId.value = id;
    await getMemberPolls();
    await getTags();
  } else {
    message.setMessage({
      message: '登入失敗，請重新登入',
    });
    message.showToast(true, 'error');
    router.push('/login');
  }
}

function openNewModal() {
  functionType.value = '新增';
  // 時間格式轉換: Mon Feb 26 2024 17:07:15 GMT+0800 (台北標準時間) → YYYY-MM-DDTHH:mm:ss.sssZ
  const currentDate = new Date();
  const isoDateString = currentDate.toISOString();
  startDate.value = `${isoDateString.slice(0, 23)}Z`;
  const taipeiDate = new Date(currentDate.getTime() + 8 * 60 * 60 * 1000);
  startDate.value = `${taipeiDate.toISOString().slice(0, 23)}Z`;

  pollData.value = {
    title: '',
    description: '',
    imageUrl: 'https://i.imgur.com/df933Ux.png',
    options: [],
    startDate: startDate.value,
    isPrivate: false,
    tags: [],
    status: 'pending',
  };
  showModal.value = 'poll';
}
async function createNewPoll(resultData) {
  const apiUrl = `${baseUrl}/api/poll/`;
  console.log('新增', resultData.value);
  const { data } = await axios.post(apiUrl, resultData, {
    headers: {
      Authorization: `Bearer ${getCookie('selectWaveToken')}`,
    },
  });
  if (data.status) {
    message.setMessage({
      message: `${data.message}`,
    });
    message.showToast(true);
    await getMemberPolls(currentPage.value);
    resultPolls.value = memberPolls.value.polls;
  } else {
    message.setMessage({
      message: `${data.message}`,
    });
    message.showToast(true, 'error');
  }
  closeModal();
}

async function openPollModal(item) {
  functionType.value = '編輯';
  const apiUrl = `${baseUrl}/api/poll/${item.id}`;
  console.log('編輯modal', item.title);
  try {
    const { data } = await axios.get(apiUrl);
    pollData.value = {
      ...data.poll,
      tags: data.poll.tags && data.poll.tags.map((tag) => tag.name),
    };
  } catch (err) {
    console.log(err);
    message.setMessage({
      title: `${err.response.data.message}`,
    });
    message.showToast(true, 'error');
  }
  showModal.value = 'poll';
  console.log('編輯modal', pollData.value);
  console.log('編輯modal', openModal.value);
}
async function updateEditPoll(result) {
  console.log('update poll', result);
  const apiUrl = `${baseUrl}/api/poll/${pollData.value.id}`;
  const { data } = await axios.put(apiUrl, result, {
    headers: {
      Authorization: `Bearer ${getCookie('selectWaveToken')}`,
    },
  });
  console.log('編輯modal成功', data);
  if (data.status) {
    console.log('編輯modal成功editPollData', data.result);
    message.setMessage({
      title: `${data.message}`,
    });
    message.showToast(true);
    await getMemberPolls(currentPage.value);
    resultPolls.value = memberPolls.value.polls;
  } else {
    message.setMessage({
      title: `${data.message}`,
    });
    message.showToast(true, 'error');
  }
  closeModal();
}
function openDelModal(item) {
  showModal.value = 'del';
  targetId.value = item.id;
  delContent.value = `「${item.title}」`;
}

const delPoll = async () => {
  const token = getCookie('selectWaveToken');
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  try {
    const { data } = await axios.delete(`${apiUrl}/api/poll/${targetId.value}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data.status) {
      message.setMessage({
        message: '刪除成功',
      });
      message.showToast(true);
      await getMemberPolls(currentPage.value);
      resultPolls.value = memberPolls.value.polls;
    }
  } catch (error) {
    message.setMessage({
      message: `${error.response.data.message}`,
    });
    message.showToast(true, 'error');
  }
  closeModal();
};

async function handlePoll(id) {
  const apiUrl = `${baseUrl}/api/poll/${id}/${pollActionType.value}`;
  const { data } = await axios.get(apiUrl, {
    headers: {
      Authorization: `Bearer ${getCookie('selectWaveToken')}`,
    },
  });
  if (data.status) {
    message.setMessage({
      message: `${data.message}`,
    });
    message.showToast(true);
    await getMemberPolls(currentPage.value);
    resultPolls.value = memberPolls.value.polls;
  } else {
    message.setMessage({
      message: `${data.message}`,
    });
    message.showToast(true, 'error');
  }
}

function handlePollAction(data, type) {
  console.log('handlePollAction', data.id, type);
  pollActionTarget.value = data.id;
  if (type === 'start') {
    conformContent.value = `開始 <span class="text-medium text-primary-dark">${data.title}</span> 投票`;
    pollActionType.value = 'start';
  } else if (type === 'end') {
    conformContent.value = `結束 <span class="text-medium text-primary-dark">${data.title}</span> 投票`;
    pollActionType.value = 'end';
  }
  showModal.value = 'conform';
}

function openShareModal(id) {
  showModal.value = 'share';
  targetId.value = id;
}

onMounted(async () => {
  await getInitialize();
  resultPolls.value = memberPolls.value.polls;
});

function filterPoll(status) {
  resultPolls.value = memberPolls.value.polls.filter((item) => {
    switch (status) {
      case '隱藏':
        return item.isPrivate === true;
      case '公開':
        return item.isPrivate === false;
      case '進行中':
        return item.status === 'active';
      case '已結束':
        return item.status === 'ended' || item.status === 'closed';
      default:
        return item;
    }
  });
  if (status === 'ALL') {
    resultPolls.value = memberPolls.value.polls;
  }
  toggleCollapse();
}
</script>

<template>
  <div class="container max-w-screen-lg">
    <div class="outline outline-1 outline-gray-3 rounded-2xl md:rounded-3xl
    pt-5 pb-10 md:pt-4 md:pb-16 px-3.5 md:px-5 mb-10 min-h-[45dvh]">
      <div class="flex justify-between mb-7 md:mb-8">
        <div class="relative">
          <button type="button"
                  class="flex items-center justify-center px-6 py-3 text-base font-medium bg-white rounded-full text-gray-1 outline outline-2 outline-gray-1 hover:outline-primary hover:text-primary"
                  @click="toggleCollapse">
            篩選
          </button>
          <!-- Dropdown menu 篩選 -->
          <div
               :class="`absolute z-10 ${showCollapse ? 'block' : 'hidden'} font-normal bg-white divide-y shadow-lg top-14 rounded-2xl w-44 animate-fade-down animate-once animate-ease-in-out`">
            <ul class="py-3 text-sm text-gray-700">
              <li class="block py-2 px-7 hover:bg-gray-100" @click="filterPoll('ALL')">所有投票
              </li>
              <li class="block py-2 px-7 hover:bg-gray-100" @click="filterPoll('隱藏')">投票狀態：隱藏
              </li>
              <li class="block py-2 px-7 hover:bg-gray-100" @click="filterPoll('公開')">投票狀態：公開
              </li>
              <li class="block py-2 px-7 hover:bg-gray-100" @click="filterPoll('進行中')">投票進行中
              </li>
              <li class="block py-2 px-7 hover:bg-gray-100" @click="filterPoll('已結束')">投票已結束
              </li>
            </ul>
          </div>
        </div>
        <button type="button"
                class="flex items-center justify-center px-6 py-3 text-base font-medium text-white rounded-full bg-gray-1 hover:bg-primary"
                @click="openNewModal">
          建立新投票
        </button>
      </div>
      <div class="relative overflow-x-auto">
        <table class="w-full text-base text-center table-auto text-gray-1 min-w-max">
          <thead class="uppercase text-gray-2">
            <tr class="border-b">
              <th scope="col" class="px-6 py-3 font-medium text-left">
                投票題目
              </th>
              <th scope="col" class="hidden px-6 py-3 font-medium lg:table-cell">
                顯示狀態
              </th>
              <th scope="col" class="hidden px-6 py-3 font-medium lg:table-cell">
                參與人數
              </th>
              <th scope="col" class="hidden px-6 py-3 font-medium lg:table-cell">
                開始日期
              </th>
              <th scope="col" class="hidden px-6 py-3 font-medium lg:table-cell">
                結束日期
              </th>
              <th scope="col" class="hidden px-6 py-3 font-medium lg:table-cell">
                投票狀態
              </th>
              <th scope="col" class="hidden px-6 py-3 font-medium lg:table-cell">
                分享
              </th>
              <th scope="col" class="px-6 py-3 font-medium">
                編輯
              </th>
            </tr>
          </thead>
          <tbody v-if="resultPolls && resultPolls.length > 0">
            <tr class="bg-white hover:bg-primary-light/35 text-gray-1"
                :class="resultPolls.length - 1 !== index && 'border-b'"
                v-for="(item, index) in resultPolls" :key="item.id">
              <th scope="row"
                  class="px-6 py-4 font-medium text-left whitespace-nowrap lg:text-center">
                <p class="text-left">{{ item.title }}</p>
                <p class="block lg:hidden">顯示：{{ item.isPrivate ? '隱藏' : '公開' }}</p>
                <p class="block lg:hidden">人數：{{ item.totalVoters }}</p>
                <p class="block lg:hidden">開始：{{ turnDate(item.startDate) }}</p>
                <p class="block lg:hidden">結束：{{ turnDate(item.endDate) }}</p>
                <p class="block lg:hidden">狀態：{{ item.status === 'pending' ? '未開始' : item.status ===
                    'active' ? '投票中' : item.status === 'ended' ? '投票截止' : '結束投票' }}</p>
              </th>
              <td class="hidden px-6 py-4 lg:table-cell">
                {{ item.isPrivate ? '隱藏' : '公開' }}
              </td>
              <td class="hidden px-6 py-4 lg:table-cell">
                {{ item.totalVoters }}
              </td>
              <td class="hidden px-6 py-4 lg:table-cell">
                {{ turnDate(item.startDate) }}
              </td>
              <td class="hidden px-6 py-4 lg:table-cell">
                {{ turnDate(item.endDate) }}
              </td>
              <td class="hidden px-6 py-4 lg:table-cell">
                {{
                    item.status === 'pending' ? '未開始' :
                      item.status === 'active' ? '投票中' :
                        item.status === 'ended' ? '投票截止' : '結束投票'
                  }}
              </td>
              <td class="hidden px-6 py-4 lg:table-cell">
                <button type="button" class="hover:text-primary" @click="openShareModal(item.id)">
                  <i class="w-full text-xl bi bi-share" />
                </button>
              </td>
              <td
                  class="flex flex-col justify-center gap-4 px-6 py-4 lg:justify-between lg:flex-row">
                <button type="button" class="hover:text-primary lg:hidden mb-3.5 lg:mb-0"
                        @click="openShareModal(item.id)">
                  <i class="w-full text-xl bi bi-share" />
                </button>
                <button type="button" class="hover:text-primary mb-3.5 lg:mb-0"
                        @click="openDelModal(item)">
                  <i class="w-full text-xl bi bi-trash3" />
                </button>
                <button type="button" class="hover:text-primary mb-3.5 lg:mb-0"
                        @click="openPollModal(item)">
                  <i class="w-full text-xl bi bi-pencil" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="resultPolls.length === 0" class="grid w-full h-full px-6 py-4 text-center min-h-[30dvh] place-content-center">
          <p class="text-gray-2">您沒有目前沒有開啟任何投票</p>
        </div>
      </div>
    </div>
    <Pagination :totalPage="totalPage" :currentPage="currentPage" @updatePage="getMemberPolls" />
  </div>
  <PollModal v-if="showModal === 'poll'" :openModal="showModal === 'poll'"
  :functionType="functionType" :propsPollData="pollData"
             :allTags="allTags" :selectedTagsProps="pollData.tags"
             :closeModal="closeModal" :propsHandlePollAction="handlePollAction"
             :submitFunction="functionType === '新增' ? createNewPoll : updateEditPoll"
             />
  <DelModal v-if="showModal === 'del'" :openModal="showModal === 'del'" :closeModal="closeModal" :delPoll="delPoll"
            :delContent="delContent" :contentType="'投票'" />
  <ConformModal v-if="showModal === 'conform'" :openModal="showModal === 'conform'" :closeModal="closeModal"
                :conformContent="conformContent" :fulfillsFunction="handlePoll" />
  <shareModal v-if="showModal === 'share'" :openModal="showModal === 'share'" :closeModal="closeModal"
              :id="targetId" />
</template>
