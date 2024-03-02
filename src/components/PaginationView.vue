<template>
  <nav>
    <ul class="inline-flex -space-x-px text-base h-10 w-full justify-center">
      <li>
        <a href="#" class="PaginationFixContainer flex items-center justify-center p-2 leading-tight
          text-gray-1 bg-white border border-gray-4 rounded-lg
          hover:bg-primary-light hover:text-primary-dark mr-1.5"
          :class="{ 'pointer-events-none text-gray-3' : currentPage === 1 }">
          <span class="sr-only">回到第一頁</span>
          <i class="bi bi-chevron-double-left text-sm"></i>
        </a>
      </li>
      <li>
        <a href="#" class="PaginationFixContainer flex items-center justify-center p-2 leading-tight
          text-gray-1 bg-white border border-gray-4 rounded-lg
          hover:bg-primary-light hover:text-primary-dark mr-1.5"
          :class="{ 'pointer-events-none text-gray-3' : currentPage === 1 }"
          @click.prevent="$emit('updatePage', currentPage - 1)">
          <span class="sr-only">Previous</span>
          <i class="bi bi-chevron-left text-sm"></i>
        </a>
      </li>
      <li v-for="(item, index) in totalPage" :key="index">
        <a href="#" class="PaginationFixContainer flex items-center justify-center p-2 leading-tight
          text-gray-1  border border-gray-4 rounded-lg
          hover:bg-primary-light hover:text-primary-dark mr-1.5"
          :class="{ 'bg-primary-light text-primary-dark' : item === currentPage }"
          @click.prevent="$emit('updatePage', item)">
          {{ item }}
        </a>
      </li>
      <li>
        <a href="#" class="PaginationFixContainer flex items-center justify-center p-2 leading-tight
          text-gray-1 bg-white border border-gray-4 rounded-lg
          hover:bg-primary-light hover:text-primary-dark mr-1.5"
          :class="{ 'pointer-events-none text-gray-3' : currentPage === totalPage }"
          @click.prevent="$emit('updatePage', currentPage + 1)">
          <span class="sr-only">Next</span>
          <i class="bi bi-chevron-right text-sm"></i>
        </a>
      </li>
      <li>
        <a href="#" class="PaginationFixContainer flex items-center justify-center p-2 leading-tight
          text-gray-1 bg-white border border-gray-4 rounded-lg
          hover:bg-primary-light hover:text-primary-dark"
          :class="{ 'pointer-events-none opacity-50' : currentPage === totalPage }"
          @click.prevent="$emit('updatePage', totalPage)">
          <span class="sr-only">到最後一頁</span>
          <i class="bi bi-chevron-double-right tex-sm"></i>
        </a>
      </li>
    </ul>
  </nav>
</template>
<script>
export default {
  props: ['totalPage', 'currentPage'],
};
</script>

<style>
.PaginationFixContainer{
  width: 32px;
  height: 32px;
}
</style>
