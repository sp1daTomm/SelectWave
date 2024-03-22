<template>
  <div v-if="status">
    <Navbar />
    <NavbarBackend />
    <router-view />
    <ComponentFooter />
  </div>
</template>
<script>
import NavbarBackend from '@/components/backend/NavbarBackend.vue';
import ComponentFooter from '@/components/ComponentFooter.vue';
import Navbar from '@/components/NavbarEl.vue';
import { useMemberStore } from '@/stores/member';
import { deleteCookie } from '@/utils';

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
      window.location.href = '/login';
      deleteCookie('selectWaveToken');
    }
  },
};
</script>
