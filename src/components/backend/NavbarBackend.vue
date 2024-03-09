<template>
  <div class="max-w-screen-lg mx-auto py-4 px-3">
    <ul class="flex p-1 justify-center md:justify-start">
      <li class="relative">
        <router-link :to="{ name: 'Account' }"
        class="bg-gray-4 rounded-s-3xl block px-6 py-3 font-medium hover:text-primary hover:after:absolute hover:after:rounded hover:after:left-4 hover:after:inset-y-3.5 hover:after:-translate-x-1 hover:after:w-1 hover:after:h-5 hover:after:bg-primary"
        :class="[ isActive('Account') ? ' active:text-primary font-medium after:absolute after:rounded after:left-4 after:inset-y-3.5 after:-translate-x-1 after:w-1 after:h-5 after:bg-primary text-primary' : '']">
          帳戶設定
        </router-link>
      </li>
      <li class="relative">
        <router-link :to="{ name: 'Vote' }"
        class="bg-gray-4 block px-6 py-3  hover:text-primary font-medium hover:after:absolute hover:after:rounded hover:after:left-4 hover:after:inset-y-3.5 hover:after:-translate-x-1 hover:after:w-1 hover:after:h-5 hover:after:bg-primary"
        :class="[ isActive('Vote') ? ' active:text-primary font-medium after:absolute after:rounded after:left-4 after:inset-y-3.5 after:-translate-x-1 after:w-1 after:h-5 after:bg-primary text-primary' : '']"
        >
          投票項目
        </router-link>
      </li>
      <li class="relative">
        <router-link :to="{ name: 'CommentView' }"
        class="bg-gray-4 rounded-e-3xl block px-6 py-3 hover:text-primary font-medium hover:after:absolute hover:after:rounded hover:after:left-4 hover:after:inset-y-3.5 hover:after:-translate-x-1 hover:after:w-1 hover:after:h-5 hover:after:bg-primary"
        :class="[ isActive('CommentView') ? ' active:text-primary font-medium after:absolute after:rounded after:left-4 \after:inset-y-3.5 after:-translate-x-1 after:w-1 after:h-5 after:bg-primary text-primary' : '']">
          投票評論
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script>

export default {
  data() {
    return {};
  },
  methods: {
    isActive(route) {
      return this.$route.name === route;
    },
  },
};
</script>

<style scoped></style>
