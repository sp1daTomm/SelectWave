<template>
  <router-view v-if="status" />
</template>
<script>
import { useMemberStore } from '../../stores/member';

export default {
  data() {
    return {
      status: false,
    };
  },
  computed: {
    memberStore() {
      return useMemberStore();
    },
  },
  watch: {
    memberStore: {
      handler() {
        this.status = this.memberStore.isLogin;
      },
      deep: true,
    },
  },
  created() {
    if (this.memberStore.isLogin) {
      this.status = true;
    } else {
      this.status = false;
      this.$router.push('/login');
    }
  },
};
</script>
