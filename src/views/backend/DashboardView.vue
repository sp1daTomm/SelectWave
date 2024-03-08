<template>
  <Navbar />
  <NavbarBackend />
  <router-view v-if="status" />
  <ComponentFooter />
</template>
<script>
import NavbarBackend from '@/components/backend/NavbarBackend.vue';
import ComponentFooter from '@/components/ComponentFooter.vue';
import Navbar from '@/components/NavbarEl.vue';
import { useMemberStore } from '@/stores/member';

export default {
  components: {
    Navbar,
    NavbarBackend,
    ComponentFooter,
  },
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
