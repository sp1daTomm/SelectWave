<template>
  <nav v-if="parseInt(totalPage) !== 0">
    <ul class="inline-flex justify-center w-full h-10 -space-x-px text-base">
      <!-- 回到第一頁 -->
      <li>
        <a href="#" class="h-8 w-8 flex items-center justify-center p-2 leading-tight text-gray-1 bg-white border border-gray-4 rounded-lg hover:bg-primary-light hover:text-primary-dark mr-1.5"
           :class="{ 'pointer-events-none opacity-50' : currentPage === 1 }"
           @click.prevent="currentPage > 1 && $emit('updatePage', 1)">
          <span class="sr-only">回到第一頁</span>
          <i class="text-sm bi bi-chevron-double-left"></i>
        </a>
      </li>
      <!-- 上一頁 -->
      <li>
        <a href="#" class="h-8 w-8 flex items-center justify-center p-2 leading-tight text-gray-1 bg-white border border-gray-4 rounded-lg hover:bg-primary-light hover:text-primary-dark mr-1.5"
           :class="{ 'pointer-events-none opacity-50' : currentPage === 1 }"
           @click.prevent="currentPage > 1 && $emit('updatePage', currentPage - 1)">
          <span class="sr-only">Previous</span>
          <i class="text-sm bi bi-chevron-left"></i>
        </a>
      </li>
      <!-- 頁碼列表 -->
      <li v-for="page in parseInt(totalPage)" :key="page">
        <a href="#" class="h-8 w-8 flex items-center justify-center p-2 leading-tight text-gray-1 border border-gray-4 rounded-lg hover:bg-primary-light hover:text-primary-dark mr-1.5"
           :class="{ 'bg-primary-light text-primary-dark' : page === currentPage }"
           @click.prevent="$emit('updatePage', page)">
          {{ page }}
        </a>
      </li>
      <!-- 下一頁 -->
      <li>
        <a href="#" class="h-8 w-8 flex items-center justify-center p-2 leading-tight text-gray-1 bg-white border border-gray-4 rounded-lg hover:bg-primary-light hover:text-primary-dark mr-1.5"
           :class="{ 'pointer-events-none opacity-50' : currentPage === parseInt(totalPage)}"
           @click.prevent="currentPage < parseInt(totalPage) && $emit('updatePage', currentPage + 1)">
          <span class="sr-only">Next</span>
          <i class="text-sm bi bi-chevron-right"></i>
        </a>
      </li>
      <!-- 到最後一頁 -->
      <li>
        <a href="#" class="flex items-center justify-center w-8 h-8 p-2 leading-tight bg-white border rounded-lg text-gray-1 border-gray-4 hover:bg-primary-light hover:text-primary-dark"
           :class="{ 'pointer-events-none opacity-50' : currentPage === parseInt(totalPage)}"
           @click.prevent="currentPage < parseInt(totalPage) && $emit('updatePage', parseInt(totalPage))">
          <span class="sr-only">到最後一頁</span>
          <i class="text-sm bi bi-chevron-double-right"></i>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    totalPage: {
      type: [Number, String],
      default: 0,
    },
    currentPage: {
      type: [Number, String],
      default: 1,
    },
  },
};
</script>
