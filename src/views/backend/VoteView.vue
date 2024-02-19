<template>
  <Navbar />
  <NavbarBackend />
  <NavbarVote />
  <div class="max-w-screen-lg mx-auto px-3">
    <div class="outline outline-1 outline-gray-3 rounded-2xl md:rounded-3xl
    pt-5 pb-10 md:pt-4 md:pb-16 px-3.5 md:px-5 mb-10">
      <div class="flex justify-between mb-7 md:mb-8">
        <button type="button" class="px-6 py-3 flex items-center justify-center rounded-3xl bg-white
          text-gray-1 text-base font-medium outline outline-2 outline-gray-1
          hover:outline-primary hover:text-primary">
          篩選
        </button>
        <button type="button" class="px-6 py-3 flex items-center justify-center rounded-3xl bg-gray-1
          text-white text-base font-medium hover:bg-primary">
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
          <tr class="bg-white border-b dark:bg-gray-800 hover:bg-primary-light">
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-left
            lg:text-center">
              <p>最喜歡的電視節目</p>
              <p class="block lg:hidden">狀態：公開</p>
              <p class="block lg:hidden">人數：23</p>
              <p class="block lg:hidden">開始：2024-01-02 23:00</p>
              <p class="block lg:hidden">結束：2024-01-08 23:00</p>
            </th>
            <td class="px-6 py-4 hidden lg:table-cell">
              Silver
            </td>
            <td class="px-6 py-4 hidden lg:table-cell">
              Laptop
            </td>
            <td class="px-6 py-4 hidden lg:table-cell">
              2024/2/01
            </td>
            <td class="px-6 py-4 hidden lg:table-cell">
              2024/2/28
            </td>
            <td class="px-6 py-4 hidden lg:table-cell">
              <button type="button" class="hover:text-primary" @click="$refs.ShareModal.openModal()">
                <Share2 class="w-full" />
              </button>
            </td>
            <td class="px-6 py-4 flex flex-col justify-center
            lg:justify-between lg:flex-row">
              <button type="button" class="hover:text-primary lg:hidden mb-3.5 lg:mb-0"
                @click="$refs.ShareModal.openModal()">
                <Share2 class="w-full" />
              </button>
              <button type="button" class="hover:text-primary mb-3.5 lg:mb-0" @click="$refs.DelModal.openModal()">
                <Trash2 class="w-full" />
              </button>
              <button type="button" class="hover:text-primary mb-3.5 lg:mb-0">
                <Pencil class="w-full" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- 頁碼 -->
    <nav aria-label="Page navigation example">
      <ul class="inline-flex -space-x-px text-base h-10 w-full justify-center">
        <li>
          <a href="#" class="flex items-center justify-center px-4 h-10 ms-0 leading-tight
          text-gray-1 bg-white border border-e-0 border-gray-3 rounded-s-lg
          hover:bg-gray-100 hover:text-gray-700">
            <span class="sr-only">Previous</span>
            <svg class="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 6 10">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M5 1 1 5l4 4" />
            </svg>
          </a>
        </li>
        <li>
          <a href="#" class="flex items-center justify-center px-4 h-10 leading-tight
          text-gray-1 bg-white border border-gray-3 hover:bg-gray-100 hover:text-gray-700">
            1
          </a>
        </li>
        <li>
          <a href="#" class="flex items-center justify-center px-4 h-10 leading-tight
          text-gray-1 bg-white border border-gray-3 hover:bg-gray-100 hover:text-gray-700">
            2
          </a>
        </li>
        <li>
          <a href="#" class="flex items-center justify-center px-4 h-10 leading-tight text-gray-1
          bg-white border border-gray-3 rounded-e-lg hover:bg-gray-100 hover:text-gray-700">
            <span class="sr-only">Next</span>
            <svg class="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 6 10">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="m1 9 4-4-4-4" />
            </svg>
          </a>
        </li>
      </ul>
    </nav>
  </div>
  <DelModal ref="DelModal" :delContent="delContent"></DelModal>
  <shareModal ref="ShareModal"></shareModal>
  <ComponentFooter></ComponentFooter>
  <button type="button" @click="logout">登出</button>
</template>
<script>
import { Pencil, Share2, Trash2 } from 'lucide-vue-next';
import DelModal from '@/components/backend/DelModal.vue';
import NavbarBackend from '@/components/backend/NavbarBackend.vue';
import NavbarVote from '@/components/backend/NavbarVote.vue';
import ShareModal from '@/components/backend/ShareModal.vue';
import ComponentFooter from '@/components/ComponentFooter.vue';
import Navbar from '@/components/NavbarEl.vue';

export default {
  components: {
    Navbar,
    ComponentFooter,
    DelModal,
    ShareModal,
    NavbarBackend,
    NavbarVote,
    Trash2,
    Pencil,
    Share2,
  },
  data() {
    return {
      delContent: '「xxx投票」',
    };
  },
  methods: {
    logout() {
      const api = `${import.meta.env.VITE_APP_API_URL}/api/auth/logout`;
      this.$http.get(api)
        .then((res) => {
          console.log(res);
          if (res.data.status) {
            document.cookie = 'selectWaveToken=; path=/';
            this.$swal({
              title: `${res.data.message}`,
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
  },
};
</script>

<style scoped></style>
