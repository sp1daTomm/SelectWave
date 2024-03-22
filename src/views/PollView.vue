<script type="module">
import {
  computed, onMounted, ref, watchEffect,
} from 'vue';
import axios from 'axios';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
import PollModal from '@/components/backend/PollModal.vue';
import LoadingComponent from '@/components/LoadingComponent.vue';
import Pagination from '@/components/PaginationView.vue';
import { useMemberStore } from '@/stores/member';
import { useMessageStore } from '@/stores/message';
import { usePollStore } from '@/stores/poll';
import { getCookie, turnDate } from '@/utils';
import 'swiper/css';

export default {
  components: {
    Swiper,
    SwiperSlide,
    Pagination,
    PollModal,
    LoadingComponent,
  },
  setup() {
    const navigation = ref({
      nextEl: '#swiper-btn-next',
      prevEl: '#swiper-btn-prev',
    });

    const poll = usePollStore();

    const allPolls = computed(() => poll.allPolls);
    const sort = ref('-totalVoters');
    const selectedSort = ref('最熱門');
    const isDropdownOpen = ref(false);
    const getPolls = ref();
    const allTags = ref([]);
    const filterStatus = ref('active');
    const searchQuery = ref('');
    const isLoading = ref(false);
    const doSort = ref(false);

    const updatePage = async (page = 1) => {
      poll.updateCreatedBy('');
      await poll.getPolls(page);
    };

    async function getAllTags() {
      const baseUrl = import.meta.env.VITE_APP_API_URL;
      const { data } = await axios.get(`${baseUrl}/api/tag`);
      allTags.value = data.tags;
    }

    const sortPolls = (select) => {
      selectedSort.value = select;
      isDropdownOpen.value = false;
      switch (select) {
        case '最熱門':
          sort.value = '-totalVoters';
          break;
        case '新到舊':
          sort.value = '-createdTime';
          break;
        case '舊到新':
          sort.value = 'createdTime';
          break;
        case '已結束':
          filterStatus.value = 'closed';
          break;
        case '進行中':
          filterStatus.value = 'active';
          break;
        default:
          break;
      }
      doSort.value = true;
      poll.updateSelectedSort(sort.value);
      poll.getPolls();
    };

    function toggleDropdown() {
      isDropdownOpen.value = !isDropdownOpen.value;
    }

    function handleSearchFiler() {
      if (searchQuery.value === '') {
        poll.updateQuery('');
        poll.getPolls();
        doSort.value = true;
      } else {
        doSort.value = true;
        poll.updateQuery(searchQuery.value);
        poll.getPolls();
      }
    }

    watchEffect(() => {
      poll.updateSelectedSort(sort.value);
    });

    onMounted(async () => {
      isLoading.value = true;
      poll.updateStatus('active');
      poll.updateCreatedBy('');
      getPolls.value = await poll.getPolls();
      await getAllTags();
      isLoading.value = false;
    });

    return {
      navigation,
      modules: [Navigation],
      allPolls,
      sort,
      doSort,
      sortPolls,
      selectedSort,
      isDropdownOpen,
      toggleDropdown,
      updatePage,
      searchQuery,
      handleSearchFiler,
      isLoading,
    };
  },
  data() {
    return {
      currentCardIndex: 0,
      myPolls: [],
      pollData: {},
      currentDate: new Date(),
      turnDate,
      isLogin: false,
      memberData: {},
      showCollapse: '',
      showPollModal: false,
    };
  },
  computed: {
    member() {
      return useMemberStore();
    },
    message() {
      return useMessageStore();
    },
  },
  watch: {
    member: {
      handler() {
        this.authCheck();
      },
      deep: true,
    },
  },
  methods: {
    async getUserPolls(page = 1) {
      const baseUrl = import.meta.env.VITE_APP_API_URL;
      if (!this.member.isLogin) return;
      const { data } = await axios.get(`${baseUrl}/api/poll?createdBy=${this.memberData.id}&page=${page}`);
      this.myPolls = data.polls;
    },
    authCheck() {
      this.isLogin = this.member.isLogin;
      this.memberData = this.member.member;
    },
    toggleCollapse(id) {
      this.showCollapse = this.showCollapse === id ? '' : id;
    },
    clickOutside(event) {
      if (event.target.dataset.modal === 'myCard') {
        return;
      }
      if (!event.target.closest('[data-modal="myCard"]')) {
        this.showCollapse = '';
      }
    },
    openNewModal() {
      this.pollData = {
        title: '',
        description: '',
        imageUrl: 'https://i.imgur.com/df933Ux.png',
        options: [],
        startDate: '',
        isPrivate: false,
        tags: [],
        status: 'pending',
      };
      this.showPollModal = true;
    },
    async handleDeletePoll(id) {
      const baseUrl = import.meta.env.VITE_APP_API_URL;
      try {
        const { data } = await axios.delete(`${baseUrl}/api/poll/${id}`, {
          headers: {
            Authorization: `Bearer ${getCookie('selectWaveToken')}`,
          },
        });
        if (data.status) {
          this.message.setMessage({
            message: data.message,
          });
          this.message.showToast(true);
          this.getUserPolls();
        }
      } catch (error) {
        this.message.setMessage({
          message: error.response.data.message,
        });
        this.message.showToast(true, 'error');
      }
    },
    async handleDropDown(type, id) {
      const Url = `${window.location.href.split('#')[0]}#/voting/${id}`;
      switch (type) {
        case 'ShowDetail':
          this.$router.push(`/voting/${id}`);
          break;
        case 'CopyLink':
          if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(Url)
              .then(() => {
                this.message.setMessage({
                  message: '複製成功',
                });
                this.message.showToast(true);
              })
              .catch(() => {
                this.message.setMessage({
                  message: '複製失敗',
                });
                this.message.showToast(true, 'error');
              });
          }
          break;
        case 'DelPoll':
          this.message.setMessage({
            title: '刪除投票',
            message: '確認是否刪除投票',
          });
          (async () => {
            const result = await this.message.showConfirm();
            if (result) {
              this.handleDeletePoll(id);
            }
          })();
          break;
        default:
          break;
      }
    },
    async handleCreatePoll(result) {
      const baseUrl = import.meta.env.VITE_APP_API_URL;
      const { data } = await axios.post(`${baseUrl}/api/poll`, result, {
        headers: {
          Authorization: `Bearer ${getCookie('selectWaveToken')}`,
        },
      });
      if (data.status) {
        this.message.setMessage({
          message: data.message,
        });
        this.message.showToast(true);
        this.getUserPolls();
        this.showPollModal = false;
      } else {
        this.message.setMessage({
          message: data.message,
        });
        this.message.showToast(true, 'error');
      }
    },
    closePollModal() {
      this.showPollModal = false;
    },
  },
  created() {
    this.authCheck();
  },
  mounted() {
    this.getUserPolls();
    window.addEventListener('click', this.clickOutside);
  },
  beforeMount() {
    window.removeEventListener('click', this.clickOutside);
  },
};
</script>
<template>
    <section class="relative" v-if="isLogin">
      <div class="container flex flex-col max-w-screen-lg gap-6 pt-6 pb-12 md:py-20 md:gap-8">
        <div class="flex flex-col justify-between md:items-center md:flex-row">
          <div class="text-2xl font-bold md:text-3xl">我的投票</div>
          <div v-if="myPolls.length" class="flex flex-row w-full gap-4 button-group flex-nowrap md:w-auto">
            <RouterLink to="/admin" type="button" class="h-10 px-4 py-2 transition duration-150 rounded-md ring-transparent text-gray-1 bg-gray-4 hover:bg-white hover:ring hover:text-primary hover:ring-primary">
              投票管理
              <i class="bi bi-arrow-right"></i>
            </RouterLink>
            <button
                    class="h-10 px-4 py-2 transition duration-150 rounded-md ring-transparent text-gray-1 bg-gray-4 hover:bg-white hover:ring hover:text-primary hover:ring-primary" @click="openNewModal">
              建立投票
              <i class="bi bi-plus-lg"></i>
            </button>
          </div>
        </div>
        <div v-if="myPolls.length === 0" class="flex flex-col gap-6">
          <div class="flex flex-col items-center justify-center">
            <div class="grid w-24 h-24 mb-4 rounded-full bg-gray-4 place-content-center">
              <img src="@/assets/how_to_vote.svg" class="w-20 h-20 p-4" alt="empty" />
            </div>
            <p class="text-center text-gray-2">
              這裡還沒有任何投票！<br/>
              快點來開始一個新的投票活動吧！
            </p>
          </div>
          <button
                  class="inline-block px-6 py-2 mx-auto mt-4 text-white transition rounded-full bg-primary-dark hover:bg-primary" @click="openNewModal">
            建立投票
          </button>
        </div>
        <div class="relative">
          <swiper :slides-per-view="myPolls.length >= 4 ? 4 : Math.max(myPolls.length, 2)"
                  :breakpoints="{ 640: 2, 768: 3, 1024: 4 }" :space-between="24"
                  :loop="myPolls.length >= 4" :modules="modules"
                  :navigation="myPolls.length >= 4 ? navigation : false">
            <swiper-slide v-for="poll in myPolls" :key="poll.id">
              <div
                  @click="handleDropDown('ShowDetail', poll.id)"
                   class="relative flex flex-col overflow-hidden bg-white border-2 border-gray-300 rounded-3xl group hover:cursor-pointer">
                <div class="relative">
                  <div
                       :class="`absolute z-10 ${showCollapse === poll.id ? 'block' : 'hidden'} shadow-lg top-16 right-2 w-44 animate-fade-down animate-once animate-ease-in-out rounded-2xl overflow-hidden`">
                    <ul data-modal="myCard"
                        class="p-3 overflow-hidden text-sm font-normal text-gray-700 bg-white">
                      <li class="block py-4 px-7 hover:bg-gray-100"
                          @click="handleDropDown('ShowDetail', poll.id)">預覽
                      </li>
                      <li class="block py-4 border-b px-7 hover:bg-gray-100 border-gray-3"
                          @click="handleDropDown('CopyLink', poll.id)">複製連結
                      </li>
                      <li class="block py-4 px-7 hover:bg-gray-100"
                          @click="handleDropDown('DelPoll', poll.id)">刪除投票
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="relative">
                  <img :src="poll.imageUrl" class="object-cover w-full min-h-48 max-h-32"
                       alt="Card Image" />
                  <div
                       class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  <p class="absolute text-sm leading-normal text-white bottom-3 left-3">
                    {{ poll.endDate === null ? turnDate(poll.endDate) : `${turnDate(poll.endDate)}止`
                    }}
                  </p>
                </div>
                <button type="button" data-modal="myCard"
                        class="absolute z-50 block px-3 py-2 transition duration-300 rounded-md poll-more right-4 top-4 text-gray-4 md:opacity-0 md:group-hover:opacity-100"
                        :class="showCollapse === poll.id ? 'bg-primary-dark/80' : 'bg-gray-1/80'"
                        @click="toggleCollapse(poll.id)">
                  <i class="bi bi-three-dots dot-icon" />
                </button>
                <div class="flex flex-col justify-between h-full gap-8 p-4 pt-3 md:pt-5 md:p-6">
                  <h3 class="font-medium">{{ poll.title }}</h3>
                  <p class="text-gray-500  text-sm leading-[1.2] md:text-base md:leading-normal">
                    {{ poll.totalVoters > 0 ? `目前已投票 ${poll.totalVoters} 票` : '尚無人投票' }}
                  </p>
                </div>
              </div>
            </swiper-slide>
          </swiper>
          <button type="button" id="swiper-btn-prev" v-if="myPolls.length >= 4"
                  class="absolute hidden -translate-x-full -translate-y-1/2 md:block -left-6 top-1/2">
            <i
               class="text-3xl transition duration-150 text-gray-2 bi bi-arrow-left-circle hover:text-primary" />
          </button>
          <button type="button" id="swiper-btn-next" v-if="myPolls.length >= 4"
                  class="absolute hidden translate-x-full -translate-y-1/2 md:block -right-6 top-1/2">
            <i
               class="text-3xl transition duration-150 text-gray-2 bi bi-arrow-right-circle hover:text-primary" />
          </button>
        </div>
      </div>
      <img src="@/assets/bg.png" class="absolute bottom-0 w-full -z-10" alt="image" />
    </section>
    <section class="container max-w-screen-lg flex flex-col pt-6 pb-12 gap-6 md:pt-20 md:pb-[7.5rem] md:gap-8">
      <div class="flex flex-col justify-between md:items-center md:flex-row">
        <div class="text-2xl font-bold md:text-3xl">所有投票</div>
        <div class="flex flex-row items-center gap-4 flex-nowrap">
          <div class="relative inline-block">
            <button @click="toggleDropdown"
                    class="flex flex-row px-4 py-2 bg-white border-2 rounded-lg cursor-pointer text-primary border-primary">
              {{ selectedSort }}
              <i class="pl-1 bi bi-chevron-down"></i>
            </button>
            <div :class="{ hidden: !isDropdownOpen }" id="myDropdown"
                 class="absolute z-10 w-32 mt-2 bg-white shadow-lg rounded-2xl -left-2">
              <ul class="flex flex-col items-center px-3 py-3 text-center">
                <li
                   class="px-4 py-2 w-28 text-gray-1 rounded-2xl hover:bg-primary-light hover:text-primary-dark"
                   @click.prevent="sortPolls('最熱門')">最熱門</li>
                <li
                   class="px-4 py-2 w-28 text-gray-1 rounded-2xl hover:bg-primary-light hover:text-primary-dark"
                   @click.prevent="sortPolls('新到舊')">新到舊</li>
                <li
                   class="px-4 py-2 w-28 text-gray-1 rounded-2xl hover:bg-primary-light hover:text-primary-dark"
                   @click.prevent="sortPolls('舊到新')">舊到新</li>
              </ul>
            </div>
          </div>
          <div class="flex justify-end items-enter">
            <div class="relative">
              <input id="search" type="text" class="z-0 px-4 transition duration-150 rounded search-input focus:border-primary focus:shadow focus:outline-none focus:ring-2 focus:ring-primary" v-model="searchQuery" @keyup.enter="handleSearchFiler"
                     placeholder="搜尋投票" />
              <label for="search" class="absolute top-2 right-4">
                <i v-if="!searchQuery" class="z-20 text-gray-2 hover:text-gray-3 bi bi-search" />
              </label>
            </div>
              <button type="button" class="px-3 py-2 ml-2 transition duration-150 rounded-lg cursor-pointer hover:bg-primary-dark bg-gray-1 text-gray-4 hover:text-white" @click="handleSearchFiler">
                <i class="bi bi-search-heart" />
              </button>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-x-3 gap-y-6 md:gap-x-6 md:gap-y-12 md:grid-cols-4">
        <div v-for="poll in allPolls" :key="poll.id"
             class="relative flex flex-col h-full overflow-hidden transition duration-300 bg-white border-2 border-gray-300 rounded-3xl hover:shadow hover:cursor-pointer group"
             @click="handleDropDown('ShowDetail', poll.id)">
          <div class="relative">
            <div class="overflow-hidden">
              <img :src="poll.imageUrl"
                   class="relative object-cover w-full transition duration-300 origin-center min-h-48 max-h-32 group-hover:scale-105 poll-image-gradient"
                   alt="Card Image" />
                   <div
                       class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </div>
            <p class="absolute text-white bottom-3 left-3">
              {{ poll.endDate === null ? turnDate(poll.endDate) : `${turnDate(poll.endDate)} 止` }}
            </p>
          </div>
          <div class="flex flex-col justify-between h-full gap-8 p-4 pt-3 md:pt-5 md:p-6">
            <h3 class="font-medium">{{ poll.title }}</h3>
            <p class="text-gray-500  text-sm leading-[1.2] md:text-base md:leading-normal">
              {{ poll.totalVoters > 0 ? `目前已投票 ${poll.totalVoters} 票` : '尚無人投票' }}
            </p>
          </div>
        </div>
      </div>
      <p class="text-2xl text-center" v-if="allPolls.length === 0 && (doSort || searchQuery )">沒有符合搜尋的投票</p>
      <Pagination @updatePage="updatePage" />
    </section>
    <PollModal v-if="showPollModal" :openModal="showPollModal" :functionType="'新增'"
              :propsPollData="pollData" :selectedTagsProps="pollData.tags" :allTags="allTags"
              @submitFunction="handleCreatePoll" @closeModal="closePollModal"
              />
    <LoadingComponent v-if="isLoading" :showAnimation="isLoading" />
</template>

<style scoped>
</style>
