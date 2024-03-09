import axios from 'axios';
import { defineStore } from 'pinia';
import { getCookie } from '@/utils';

const baseUrl = import.meta.env.VITE_APP_API_URL;

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
    verifyToken() {
      const token = getCookie('selectWaveToken');
      if (token) {
        return axios.get(`${baseUrl}/api/auth/check`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => {
            if (res.data.success) {
              return res.data;
            }
            return res.data;
          });
      }
      return false;
    },
  },
});

export default useMemberStore;
