<template>
  <div ref="appRef" id="provider">
    <RouterView />
  </div>
</template>

<script setup>
import {
  inject, onMounted, provide, ref,
} from 'vue';
import axios from 'axios';
import { useMemberStore } from '@/stores/member';
import { deleteCookie, getCookie, setCookie } from '@/utils';

const swal = inject('$swal');
const appRef = ref(null);
const member = useMemberStore();

provide('appRef', appRef);

const checkToken = () => {
  const token = getCookie('selectWaveToken');
  if (token !== '' && token !== null && token !== undefined && token !== false) {
    return token;
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
                <img src=${data.result.avatar} class="w-20 h-20 border-2 rounded-full md:border-4 object-fit border-gray-3" />
                <h2 class="space-y-2">
                  <span class="block font-bold">歡迎回來</span>
                  ${data.result.name}
                </h2>
              </div>`,
});

const authCheck = async (propsToken) => {
  const baseUrl = import.meta.env.VITE_APP_API_URL;
  const api = `${baseUrl}/api/auth/check`;
  const { data } = await axios.get(api, {
    headers: {
      Authorization: `Bearer ${propsToken}`,
    },
  });
  if (data.status) {
    setCookie('selectWaveToken', propsToken, 7);
    userModal(data);
    member.setMemberLoginStatus(true);
    member.setMemberStatus(true);
    member.setMemberData(data.result);
  } else {
    member.setMemberLoginStatus(false);
    member.setMemberStatus(false);
    member.setMemberData({});
    deleteCookie('selectWaveToken');
  }
};

onMounted(async () => {
  let urlToken = null;
  const { hash } = window.location;
  if (hash.includes('?')) {
    const hashParams = new URLSearchParams(hash.split('?')[1]);
    urlToken = hashParams.get('token');
  }

  if (urlToken !== '' && urlToken !== null && urlToken !== undefined) {
    await authCheck(urlToken);
  } else {
    const checkedToken = checkToken();
    await authCheck(checkedToken);
  }
});

</script>
