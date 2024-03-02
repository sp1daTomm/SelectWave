<template>
  <Navbar />
  <NavbarBackend />
  <div class="max-w-screen-lg mx-auto px-3">
    <div class="outline outline-1 outline-gray-3 rounded-2xl md:rounded-3xl
    pt-5 pb-10 md:pt-4 md:pb-16 px-3.5 md:px-5 mb-10">
      <div class="flex justify-between mb-7 md:mb-8">
        <div class="relative">
          <button type="button" class="px-6 py-3 flex items-center justify-center rounded-full bg-white
          text-gray-1 text-base font-medium outline outline-2 outline-gray-1
          hover:outline-primary hover:text-primary" @click="collapseModal.toggle()">
            篩選
          </button>
          <!-- Dropdown menu 篩選 -->
          <div ref="flowbiteCollapse"
            class="absolute top-14 z-10 hidden font-normal bg-white divide-y rounded-2xl shadow-lg w-44 animate-fade-down animate-once animate-ease-in-out">
            <ul class="py-3 text-sm text-gray-700">
              <li>
                <a href="#" class="block px-7 py-2 hover:bg-gray-100">所有投票</a>
              </li>
              <li>
                <a href="#" class="block px-7 py-2 hover:bg-gray-100">投票狀態：隱藏</a>
              </li>
              <li>
                <a href="#" class="block px-7 py-2 hover:bg-gray-100">投票狀態：公開</a>
              </li>
              <li>
                <a href="#" class="block px-7 py-2 hover:bg-gray-100">投票進行中</a>
              </li>
              <li>
                <a href="#" class="block px-7 py-2 hover:bg-gray-100">投票已結束</a>
              </li>
            </ul>
          </div>
        </div>
        <button type="button" class="px-6 py-3 flex items-center justify-center rounded-full bg-gray-1
          text-white text-base font-medium hover:bg-primary" @click="openNewModal">
          建立新投票
        </button>
      </div>
      <!-- table -->
      <table class="w-full text-base text-center text-gray-1">
        <thead class="text-gray-2 uppercase">
          <tr class="border-b">
            <th scope="col" class="px-6 py-3 font-medium">
              投票標題
            </th>
            <th scope="col" class="px-6 py-3 font-medium  hidden lg:table-cell">
              投票狀態
            </th>
            <th scope="col" class="px-6 py-3 font-medium  hidden lg:table-cell">
              參與人數
            </th>
            <th scope="col" class="px-6 py-3 font-medium  hidden lg:table-cell">
              開始日期
            </th>
            <th scope="col" class="px-6 py-3 font-medium  hidden lg:table-cell">
              結束日期
            </th>
            <th scope="col" class="px-6 py-3 font-medium  hidden lg:table-cell">
              分享
            </th>
            <th scope="col" class="px-6 py-3 font-medium">
              編輯
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="item in memberPolls.polls" :key="item.id">
            <tr class="bg-white border-b hover:bg-primary-light">
              <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-left
            lg:text-center">
                <p>{{ item.title }}</p>
                <p class="block lg:hidden">狀態：{{ item.isPrivate ? '公開' : '隱藏' }}</p>
                <p class="block lg:hidden">人數：{{ item.totalVoters }}</p>
                <p class="block lg:hidden">開始：{{ turnDate(item.startDate) }}</p>
                <p class="block lg:hidden">結束：{{ turnDate(item.endDate) }}</p>
              </th>
              <td class="px-6 py-4 hidden lg:table-cell">
                {{ item.isPrivate ? '公開' : '隱藏' }}
              </td>
              <td class="px-6 py-4 hidden lg:table-cell">
                {{ item.totalVoters }}
              </td>
              <td class="px-6 py-4 hidden lg:table-cell">
                {{ turnDate(item.startDate) }}
              </td>
              <td class="px-6 py-4 hidden lg:table-cell">
                {{ turnDate(item.endDate) }}
              </td>
              <td class="px-6 py-4 hidden lg:table-cell">
                <button type="button" class="hover:text-primary" @click="$refs.ShareModal.openModal">
                  <i class="bi bi-share w-full text-xl"></i>
                </button>
              </td>
              <td class="px-6 py-4 flex flex-col justify-center
            lg:justify-between lg:flex-row">
                <button type="button" class="hover:text-primary lg:hidden mb-3.5 lg:mb-0"
                  @click="$refs.ShareModal.openModal">
                  <i class="bi bi-share w-full text-xl"></i>
                </button>
                <button type="button" class="hover:text-primary mb-3.5 lg:mb-0" @click="openDelModal()">
                  <i class="bi bi-trash3 w-full text-xl"></i>
                </button>
                <button type="button" class="hover:text-primary mb-3.5 lg:mb-0" @click="openEditModal(item)">
                  <i class="bi bi-pencil w-full text-xl"></i>
                </button>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <Pagination :totalPage="totalPage" :currentPage="currentPage" @updatePage="getMemberPolls" />
  </div>
  <AddPullModal ref="AddPullModal" :addPollData="addPollData" :optionsData="addPollData.optionsData"
    :selectedTagsProps="addPollData.tags" :allTags="allTags" @update-poll="updateNewPoll" />
  <EditPullModal ref="EditPullModal" :editPollData="editPollData" :allTags="allTags" :optionsData="editPollData.options"
    :selectedTagsProps="editPollData.tags" @update-poll="updateEditPoll" />
  <DelModal ref="DelModal" :delContent="delContent"></DelModal>
  <shareModal ref="ShareModal"></shareModal>
  <ComponentFooter></ComponentFooter>
</template>
<script>
import { mapActions } from 'pinia';
import AddPullModal from '@/components/backend/AddPullModal.vue';
import DelModal from '@/components/backend/DelModal.vue';
import EditPullModal from '@/components/backend/EditPullModal.vue';
import NavbarBackend from '@/components/backend/NavbarBackend.vue';
import ShareModal from '@/components/backend/ShareModal.vue';
import ComponentFooter from '@/components/ComponentFooter.vue';
import Navbar from '@/components/NavbarEl.vue';
import Pagination from '@/components/PaginationView.vue';
import CollapseMixin from '@/mixins/CollapseMixin';
import dateStore from '@/stores/date';

export default {
  mixins: [CollapseMixin],
  components: {
    Navbar,
    ComponentFooter,
    DelModal,
    ShareModal,
    NavbarBackend,
    AddPullModal,
    EditPullModal,
    Pagination,
  },
  data() {
    return {
      memberId: '',
      totalPage: '',
      currentPage: '', // 當前頁數
      collapseModal: null,
      delContent: '「xxx投票」',
      memberPolls: [ // member投票資料
      ],
      addPollData: { // 新增投票Modal的資料
        title: '',
        description: '',
        imageUrl: 'https://i.imgur.com/D3hp8H6.png',
        tags: [],
        startDate: '',
        endDate: '',
        isPrivate: false,
        optionsData: [
          {
            title: '',
            imageUrl: 'https://imgur.com/TECsq2J.png',
          },
        ],
        status: 'active',
      },
      editPollData: { // 編輯投票Modal的資料
        options: [],
      },
      allTags: [],
      startDate: '',
      endDate: null,
    };
  },
  methods: {
    getToken() {
      // 從 cookie 取出 token，所有 axios 請求都會加上 token
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)selectWaveToken\s*=\s*([^;]*).*$)|^.*$/,
        '$1',
      );
      this.$http.defaults.headers.common.Authorization = token;
      // 檢查用戶是否仍持續登入API
      const api = `${import.meta.env.VITE_APP_API_URL}/api/auth/check`;
      this.$http.get(api, {
        headers: {
          Authorization: token,
        },
      })
        .then((response) => {
          if (response.data.status) {
            const { id } = response.data.result;
            this.memberId = id;
            this.getMemberPolls();
          } else {
            this.$swal({
              title: '登入失敗，請重新登入',
            });
            this.$router.push('/login');
          }
        })
        .catch((err) => {
          this.$swal({
            title: `${err.response.data.message}`,
          });
        });
    },
    getMemberPolls(page = 1) {
      const apiUrl = `${import.meta.env.VITE_APP_API_URL}/api/poll?createdBy=${this.memberId}&?page=${page}`;
      // const apiUrl = `${import.meta.env.VITE_APP_API_URL}/api/poll?page=${page}`;
      this.$http.get(apiUrl)
        .then((res) => {
          if (res.status === 200) {
            console.log('getMemberPolls', res);
            this.memberPolls = res.data;
            this.totalMemberPolls = res.data.total;
            // 頁碼
            this.currentPage = res.data.page;
            this.perPage = res.data.limit;
            this.totalPage = Math.ceil(this.totalMemberPolls / this.perPage);
          }
        })
        .catch((err) => {
          console.log(err);
          this.$swal({
            title: `${err.response.data.message}`,
          });
        });
    },
    getTags() {
      const apiUrl = `${import.meta.env.VITE_APP_API_URL}/api/tag/`;
      this.$http.get(apiUrl)
        .then((res) => {
          console.log('所有標籤', res.data.result);
          this.allTags = res.data.result.flatMap((poll) => poll.name);

          // 移除重覆的標籤
          // const filterAlltags = new Set(allTags);
          // this.allTags = [...filterAlltags];
        })
        .catch((err) => {
          console.log(err);
        });
    },
    openNewModal() {
      // 時間格式轉換: Mon Feb 26 2024 17:07:15 GMT+0800 (台北標準時間) → YYYY-MM-DDTHH:mm:ss.sssZ
      const currentDate = new Date();
      const isoDateString = currentDate.toISOString();
      let startDate = `${isoDateString.slice(0, 23)}Z`;
      const taipeiDate = new Date(currentDate.getTime() + 8 * 60 * 60 * 1000);
      startDate = `${taipeiDate.toISOString().slice(0, 23)}Z`;

      this.addPollData = {
        imageUrl: 'https://i.imgur.com/D3hp8H6.png',
        optionsData: [
          {
            title: '',
            imageUrl: 'https://imgur.com/TECsq2J.png',
          },
        ],
        startDate,
        isPrivate: false,
        tags: [],
      };
      this.$refs.AddPullModal.openModal();
    },
    updateNewPoll() {
      const apiUrl = `${import.meta.env.VITE_APP_API_URL}/api/poll/`;
      this.$http.post(apiUrl, this.addPollData)
        .then((res) => {
          if (res.status === 200) {
            this.getMemberPolls();
            console.log('更新', this.addPollData);
            this.$swal({
              title: `${res.data.message}`,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.$swal({
            title: `${err.response.data.message}`,
          });
        });
      this.$refs.AddPullModal.hideModal();
    },
    openEditModal(item) {
      const apiUrl = `${import.meta.env.VITE_APP_API_URL}/api/poll/${item.id}`;
      console.log('openEditModal', item);
      this.$http.get(apiUrl)
        .then((res) => {
          this.editPollData = res.data.poll;
        })
        .catch((err) => {
          this.$swal({
            title: `${err.response.data.message}`,
          });
        });
      this.$refs.EditPullModal.openModal();
    },
    updateEditPoll() {
      console.log('編輯modal', this.editPollData);
      const apiUrl = `${import.meta.env.VITE_APP_API_URL}/api/poll/${this.editPollData.id}`;
      this.$http.put(apiUrl, this.editPollData)
        .then((res) => {
          console.log('編輯modal成功', res.data);
          this.getMemberPolls();
          console.log('編輯modal成功editPollData', this.editPollData);
          this.$swal({
            title: `${res.data.message}`,
          });
        })
        .catch((err) => {
          this.$swal({
            title: `${err.response.data.message}`,
          });
        });
      this.$refs.EditPullModal.hideModal();
    },
    openDelModal() {
      this.$refs.DelModal.openModal();
    },
    ...mapActions(dateStore, ['turnDate']),
  },
  mounted() {
    this.getToken();
    this.getTags();
  },
};
</script>

<style scoped>
.pagination-w {
  width: 32px;
  height: 32px;
}
</style>
