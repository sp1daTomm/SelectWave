<template>
  <div class="max-w-screen-lg mx-auto pt-4 pb-2 px-3">
    <ul class="flex p-1 justify-center">
      <li class="relative">
        <router-link :to="{ name: 'Vote' }"
        class="bg-white border border-gray-4 border-r-0 rounded-s-3xl block px-3 md:px-6 py-3  font-medium hover:text-primary hover:after:absolute hover:after:rounded hover:after:left-2 md:hover:after:left-4 hover:after:inset-y-4 hover:after:-translate-x-1 hover:after:w-1 hover:after:h-5 hover:after:bg-primary"
        :class="[ isActive('Vote') ? 'after:absolute after:rounded after:left-2 md:after:left-4 after:inset-y-4 after:-translate-x-1 after:w-1 after:h-5 after:bg-primary text-primary' : '']">
          發起投票
        </router-link>
      </li>
      <li class="relative">
        <router-link :to="{ name: '' }"
        class="bg-white border border-t-gray-4 border-b-gray-4 border-x-0 block px-3 md:px-6 py-3 font-medium hover:text-primary hover:after:absolute hover:after:rounded hover:after:left-2 md:hover:after:left-4 hover:after:inset-y-4 hover:after:-translate-x-1 hover:after:w-1 hover:after:h-5 hover:after:bg-primary"
        :class="[ isActive('') ? 'after:absolute after:rounded after:left-2 md:after:left-4 after:inset-y-4 after:-translate-x-1 after:w-1 after:h-5 after:bg-primary text-primary' : '']">
          投票紀錄
        </router-link>
      </li>
      <li class="relative">
        <router-link :to="{ name: '' }"
        class="bg-white border border-t-gray-4 border-b-gray-4 border-x-0 block px-3 md:px-6 py-3 font-medium hover:text-primary hover:after:absolute hover:after:rounded hover:after:left-2 md:hover:after:left-4 hover:after:inset-y-4 hover:after:-translate-x-1 hover:after:w-1 hover:after:h-5 hover:after:bg-primary"
        :class="[ isActive('') ? 'after:absolute after:rounded after:left-2 md:after:left-4 after:inset-y-4 after:-translate-x-1 after:w-1 after:h-5 after:bg-primary text-primary' : '']">
          參與投票
        </router-link>
      </li>
      <li class="relative">
        <router-link :to="{ name:'' }"
        class="bg-white border border-gray-4 border-l-0 rounded-e-3xl block px-3 md:px-6 py-3 font-medium hover:text-primary hover:after:absolute hover:after:rounded hover:after:left-2 md:hover:after:left-4 hover:after:inset-y-4 hover:after:-translate-x-1 hover:after:w-1 hover:after:h-5 hover:after:bg-primary"
        :class="[ isActive('') ? 'after:absolute after:rounded after:left-2 md:after:left-4 after:inset-y-4 after:-translate-x-1 after:w-1 after:h-5 after:bg-primary text-primary' : '']">
          投票留言
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  methods: {
    isActive(route) {
      return this.$route.name === route;
    },
  },
};
</script>
