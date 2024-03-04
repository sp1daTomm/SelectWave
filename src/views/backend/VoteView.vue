<script setup>
import {
  inject, onMounted, ref,
} from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import DelModal from '@/components/backend/DelModal.vue';
import EditModal from '@/components/backend/EditModal.vue';
import ShareModal from '@/components/backend/ShareModal.vue';
import Pagination from '@/components/PaginationView.vue';
import { useMemberStore } from '@/stores/member';
import { turnDate } from '@/utils';

const baseUrl = import.meta.env.VITE_APP_API_URL;

const member = useMemberStore();

const router = useRouter();

const swal = inject('$swal');

const showCollapse = ref(false);
const toggleCollapse = () => {
  showCollapse.value = !showCollapse.value;
};

const showShare = ref(false);
const showDel = ref(false);

const closeShareModal = () => {
  showShare.value = false;
};
const closeDelModal = () => {
  showDel.value = false;
};

const functionType = ref('新增');
const memberId = ref('');
const totalPage = ref('');
const currentPage = ref('');
const targetId = ref('');

const delContent = ref('「xxx投票」');
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
  optionsData: [],
  status: 'active',
});

const allTags = ref([]);
const startDate = ref('');
const totalMemberPolls = ref(0);
const perPage = ref(0);

const openModal = ref(false);
const closeModal = () => {
  openModal.value = false;
  pollData.value = {
    imageUrl: 'https://i.imgur.com/df933Ux.png',
    optionsData: [],
    startDate: '',
    isPrivate: false,
    tags: [],
  };
  console.log('closeModal', pollData.value);
  console.log('closeModal', openModal.value);
};

async function getMemberPolls(page = 1) {
  const apiUrl = `${baseUrl}/api/poll?createdBy=${memberId.value}&?page=${page}`;
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
    console.log(err);
    swal({
      title: `${err.response.data.message}`,
    });
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
    swal({
      title: '登入失敗，請重新登入',
    });
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
    imageUrl: 'https://i.imgur.com/df933Ux.png',
    optionsData: [],
    startDate,
    isPrivate: false,
    tags: [],
  };
  openModal.value = true;
}
function createNewPoll() {
  functionType.value = '新增';
  const apiUrl = `${baseUrl}/api/poll/`;
  axios.post(apiUrl, pollData.value)
    .then((res) => {
      if (res.status === 200) {
        getMemberPolls();
        console.log('更新', pollData.value);
        swal({
          title: `${res.data.message}`,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      swal({
        title: `${err.response.data.message}`,
      });
    });
  closeModal();
}
async function openEditModal(item) {
  functionType.value = '編輯';
  const apiUrl = `${baseUrl}/api/poll/${item.id}`;
  console.log('編輯modal', item.title);
  try {
    const { data } = await axios.get(apiUrl);
    pollData.value = data.poll;
  } catch (err) {
    swal({
      title: `${err.response.data.message}`,
    });
  }
  openModal.value = true;
  console.log('編輯modal', pollData.value);
  console.log('編輯modal', openModal.value);
}
function updateEditPoll() {
  console.log('編輯modal', pollData.value);
  const result = pollData.value.options.filter((item) => {
    return item.title !== '';
  });
  pollData.value.options = result;
  const apiUrl = `${baseUrl}/api/poll/${pollData.value.id}`;
  axios.put(apiUrl, pollData.value)
    .then((res) => {
      console.log('編輯modal成功', res.data);
      this.getMemberPolls();
      console.log('編輯modal成功editPollData', pollData.value);
      swal({
        title: `${res.data.message}`,
      });
    })
    .catch((err) => {
      swal({
        title: `${err.response.data.message}`,
      });
    });
  closeModal();
}
function openDelModal(item) {
  showDel.value = true;
  targetId.value = item.id;
  delContent.value = `「${item.title}」`;
}

function openShareModal(id) {
  showShare.value = true;
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
  <div class="container">
    <div class="outline outline-1 outline-gray-3 rounded-2xl md:rounded-3xl
    pt-5 pb-10 md:pt-4 md:pb-16 px-3.5 md:px-5 mb-10">
      <div class="flex justify-between mb-7 md:mb-8">
        <div class="relative">
          <button type="button" class="flex items-center justify-center px-6 py-3 text-base font-medium bg-white rounded-full text-gray-1 outline outline-2 outline-gray-1 hover:outline-primary hover:text-primary" @click="toggleCollapse">
            篩選
          </button>
          <!-- Dropdown menu 篩選 -->
          <div :class="`absolute z-10 ${showCollapse ? 'block' : 'hidden'} font-normal bg-white divide-y shadow-lg top-14 rounded-2xl w-44 animate-fade-down animate-once animate-ease-in-out`">
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
        <button type="button" class="flex items-center justify-center px-6 py-3 text-base font-medium text-white rounded-full bg-gray-1 hover:bg-primary" @click="openNewModal">
          建立新投票
        </button>
      </div>
      <div class="relative overflow-x-auto">
        <table class="w-full text-base text-center table-auto text-gray-1 min-w-max">
          <thead class="uppercase text-gray-2">
            <tr class="border-b">
              <th scope="col" class="px-6 py-3 font-medium text-left">
                投票標題
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
            <tbody>
              <tr class="bg-white hover:bg-primary-light" :class="resultPolls.length - 1 !== index && 'border-b'" v-for="(item, index) in resultPolls" :key="item.id">
                <th scope="row" class="px-6 py-4 font-medium text-left text-gray-900 whitespace-nowrap lg:text-center">
                  <p class="text-left">{{ item.title }}</p>
                  <p class="block lg:hidden">顯示：{{ item.isPrivate ? '隱藏' : '公開' }}</p>
                  <p class="block lg:hidden">人數：{{ item.totalVoters }}</p>
                  <p class="block lg:hidden">開始：{{ turnDate(item.startDate) }}</p>
                  <p class="block lg:hidden">結束：{{ turnDate(item.endDate) }}</p>
                  <p class="block lg:hidden">狀態：{{ item.status === 'pending' ? '未開始' : item.status === 'active' ? '投票中' : item.status === 'ended' ? '投票截止' : '結束投票' }}</p>
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
                <td class="flex flex-col justify-center gap-4 px-6 py-4 lg:justify-between lg:flex-row">
                  <button type="button"
                  class="hover:text-primary lg:hidden mb-3.5 lg:mb-0"
                    @click="openShareModal(item.id)">
                    <i class="w-full text-xl bi bi-share" />
                  </button>
                  <button type="button"
                  class="hover:text-primary mb-3.5 lg:mb-0"
                  @click="openDelModal(item)">
                    <i class="w-full text-xl bi bi-trash3" />
                  </button>
                  <button type="button"
                  class="hover:text-primary mb-3.5 lg:mb-0"
                  @click="openEditModal(item)">
                    <i class="w-full text-xl bi bi-pencil" />
                  </button>
                </td>
              </tr>
            </tbody>
        </table>
      </div>
    </div>
    <Pagination :totalPage="totalPage" :currentPage="currentPage" @updatePage="getMemberPolls" />
  </div>
  <EditModal
  v-if="openModal" :functionType="functionType"
  :pollData="pollData"
  :allTags="allTags"
  :optionsData="pollData.optionsData"
    :selectedTagsProps="pollData.tags" :type="functionType"
    :closeModal="closeModal" :openModal="openModal"
    :submitFunction="functionType === '新增' ? createNewPoll : updateEditPoll" />
  <DelModal v-if="showDel" :openModal="showDel" :delContent="delContent" :closeModal="closeDelModal" :id="targetId" />
  <shareModal v-if="showShare" :openModal="showShare" :closeModal="closeShareModal" :id="targetId" />
</template>
