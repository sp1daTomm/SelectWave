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
          text-white text-base font-medium hover:bg-primary" @click="openModal">
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
            <th scope="col" class="px-6 py-3 font-medium">
              討論人數
            </th>
            <th scope="col" class="px-6 py-3 font-medium  hidden lg:table-cell">
              開始日期
            </th>
            <th scope="col" class="px-6 py-3 font-medium  hidden lg:table-cell">
              結束日期
            </th>
            <th scope="col" class="px-6 py-3 font-medium">
              查閱
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- <template v-for="item in memberPolls.polls" :key="item.id">
            <tr class="bg-white border-b hover:bg-primary-light">
              <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-left
            lg:text-center">
                <p>{{ item.title }}</p>
                <p class="block lg:hidden">開始：{{ turnDate(item.startDate) }}</p>
                <p class="block lg:hidden">結束：{{ turnDate(item.endDate) }}</p>
              </th>
              <td class="px-6 py-4">
                {{ item.totalVoters }}
              </td>
              <td class="px-6 py-4 hidden lg:table-cell">
                {{ turnDate(item.startDate) }}
              </td>
              <td class="px-6 py-4 hidden lg:table-cell">
                {{ turnDate(item.endDate) }}
              </td>
              <td class="px-6 py-4">
                查閱會連結到投票詳情頁
                <button type="button" class="hover:text-primary" @click="$refs.ShareModal.openModal">
                  <i class="bi bi-eyeglasses text-xl"></i>
                </button>
              </td>
            </tr>
          </template> -->
        </tbody>
      </table>
    </div>
    <Pagination />
  </div>
  <ComponentFooter />
</template>

<script>
import NavbarBackend from '@/components/backend/NavbarBackend.vue';
import ComponentFooter from '@/components/ComponentFooter.vue';
import Navbar from '@/components/NavbarEl.vue';
import Pagination from '@/components/PaginationView.vue';

export default {
  components: {
    Navbar,
    NavbarBackend,
    Pagination,
    ComponentFooter,
  },
};
</script>
