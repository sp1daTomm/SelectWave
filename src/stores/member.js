import { defineStore } from 'pinia';

export const useMemberStore = defineStore('memberStatus', {
  state: () => ({
    isLogin: false,
    isMember: false,
    member: {
    },
  }),
  actions: {
    setMemberStatus(status) {
      this.isMember = status;
    },
    setMemberLoginStatus(status) {
      this.isLogin = status;
    },
    setMemberData(data) {
      this.member = data;
    },
  },
});

export default useMemberStore;
