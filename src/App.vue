<template>
  <RouterView />
</template>

<script setup>
import { inject, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { useMemberStore } from './stores/member';
import useCookie from './utils';

const swal = inject('$swal');

const member = useMemberStore();
const route = useRoute();

const checkToken = () => {
  const token = localStorage.getItem('selectWaveToken');
  if (token) {
    return true;
  }
  return false;
};
const userModal = (data) => swal({
  toast: true,
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  position: 'top-end',
  html: `
              <div class="flex items-center gap-4">
                <img src=${data.result.avatar} class="w-20 h-20 object-fit" />
                <h2 class="space-y-2">
                  <span class="block font-bold">歡迎回來</span>
                  ${data.result.name}
                </h2>
              </div>`,
});

const checkUser = async (path, token) => {
  const { data } = await axios.get(path, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (data.status) {
    useCookie.setCookie('selectWaveToken', token, 7);
    userModal(data);
    member.setMemberLoginStatus(true);
    member.setMemberStatus(true);
    member.setMemberData(data.result);
  }
  member.setMemberLoginStatus(false);
  member.setMemberStatus(false);
};

const authCheck = async () => {
  const { token } = route.query;
  const baseUrl = import.meta.env.VITE_APP_API_URL;
  const api = `${baseUrl}/api/auth/check`;
  if (token) {
    await checkUser(api, token);
  } else if (checkToken()) {
    const cookieToken = useCookie.getCookie('selectWaveToken');
    await checkUser(api, cookieToken);
  }
};

onMounted(async () => {
  await authCheck();
});
</script>
