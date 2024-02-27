<template>
  <router-view v-if="status" />
</template>
<script>
import { useMemberStore } from '../../stores/member';
import useCookie from '../../utils';

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
  mounted() {
    const token = useCookie.getCookie('selectWaveToken');
    this.$http.get(`${import.meta.env.VITE_APP_API_URL}/api/auth/check`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(({ data }) => {
      if (data.status) {
        this.memberStore.setMemberStatus(true);
        this.memberStore.setMemberLoginStatus(true);
      }
    }).catch(() => {
      this.memberStore.setMemberStatus(false);
      this.memberStore.setMemberLoginStatus(false);
      this.$router.push('/login');
    });
  },
};
</script>
