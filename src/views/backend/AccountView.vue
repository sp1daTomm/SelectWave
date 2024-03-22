<template>
  <div class="container max-w-screen-lg">
    <div class="px-5 mb-10 outline outline-1 outline-gray-3 rounded-2xl md:rounded-3xl py-11">
      <div class="flex flex-wrap items-center justify-between max-w-3xl mx-auto mb-7 md:mb-8">
        <label class="relative flex flex-col items-center justify-center mb-5 tracking-wide uppercase bg-white border rounded-full shadow-lg cursor-pointer border-blue hover:bg-blue md:mb-0"
               style="width: 120px; height: 120px;">
          <input type="file" class="hidden" ref="fileInput" @change="uploadFile" />
          <img :src="memberPerson.avatar" class="object-cover object-center rounded-full"
               style="width: 120px; height: 120px;">
          <i class="absolute bottom-0 text-3xl right-1 bi bi-image-fill"></i>
          <div
               class="absolute inset-0 z-10 transition-opacity bg-gray-500 bg-opacity-50 rounded-full opacity-0 hover:opacity-100">
            <div class="flex items-center justify-center h-full">
              <span class="font-semibold tracking-wide text-white uppercase">
                修改頭像
              </span>
            </div>
          </div>
        </label>
        <div class="flex">
          <RouterLink :to="{ name: 'ChangePassword' }"
                      class="flex items-center justify-center px-6 py-3 mr-3 text-sm font-medium transition duration-150 bg-white border-2 rounded-full border-gray-1 text-gray-1 md:text-base hover:text-primary-dark hover:border-primary-dark">
            更改密碼</RouterLink>
          <button type="button"
                  class="flex items-center justify-center px-6 py-3 text-sm font-medium transition duration-150 bg-white border-2 rounded-full border-gray-1 text-gray-1 md:text-base hover:text-red-600 hover:border-red-600"
                  @click="$refs.DelModal.openModal()">
            刪除帳號
          </button>
        </div>
      </div>
      <form class="flex flex-col max-w-3xl gap-4 mx-auto" @submit.prevent="updateMember">
        <div>
          <label for="name" class="block mb-2 text-base font-medium text-gray-1">名稱</label>
          <input type="text" id="name"
                 class="block w-full p-4 text-sm bg-white border rounded-full border-gray-3 focus:ring-primary focus:border-primary"
                 v-model="memberPerson.name" />
        </div>
        <div>
          <label for="sex" class="block mb-2 text-base font-medium text-gray-1">性別</label>
          <select id="sex"
                  class="block w-full p-4 text-sm text-gray-900 bg-white border border-gray-300 rounded-full focus:ring-primary focus:border-primary"
                  v-model="memberPerson.gender">
            <option value="" selected disabled>請選擇性別</option>
            <option value="male">男</option>
            <option value="female">女</option>
            <option value="x">不方便透露</option>
          </select>
        </div>
        <div>
          <label for="birthday" class="block mb-2 text-base font-medium text-gray-1">生日</label>
          <input v-if="!memberPerson.birthday" type="date" id="birthday"
                 class="block w-full p-4 text-sm bg-white border rounded-full border-gray-3 focus:ring-primary focus:border-primary"
                 v-model="birthday" @input="clickDate" />
          <input v-else type="date" id="birthday"
                 class="block w-full p-4 text-sm bg-white border rounded-full border-gray-3 focus:ring-primary focus:border-primary"
                 v-model="birthday" @input="clickDate" />
        </div>
        <div class="flex flex-wrap gap-y-4">
          <div class="flex-auto w-1/2 px-2" v-for="(item, index) in memberPerson.socialMedia"
               :key="index">
            <label for="facebookUrl" class="block mb-2 text-base font-medium text-gray-1">
              {{ memberPerson.socialMedia[ index ].type }} 社群連結
            </label>
            <input type="url"
                   class="block w-full p-4 mb-2 text-sm bg-white border rounded-full border-gray-3 focus:ring-primary focus:border-primary"
                   placeholder="請填入社群網址" v-model="memberPerson.socialMedia[ index ].id" />
          </div>
        </div>
        <button type="submit" class="text-white bg-gray-1 hover:bg-primary-dark focus:ring-4
            focus:outline-none focus:ring-primary-light font-medium rounded-full
            text-base w-full sm:w-auto px-5 py-2.5 text-center transition duration-150">
          更新
        </button>
      </form>
    </div>
  </div>
  <AccountResetPasswordModal ref="AccountResetPasswordModal" />
  <DelModal ref="DelModal" :delContent="delContent"></DelModal>
</template>
<script>
import AccountResetPasswordModal from '@/components/backend/AccountResetPasswordModal.vue';
import DelModal from '@/components/backend/DelModal.vue';

export default {
  components: {
    DelModal,
    AccountResetPasswordModal,
  },
  data() {
    return {
      delContent: '「此帳號後，需重新建立帳號」',
      memberId: '',
      memberPerson: { // 根據ID獲取會員詳細資料
        name: '',
        gender: 'x',
        avatar: 'https://i.imgur.com/xcLTrkV.png',
        follwing: [],
        followers: [],
        socialMedia: [],
        likedPolls: [],
      },
      birthday: '',
    };
  },
  methods: {
    getToken() {
      // 從 cookie 取出 token，所有 axios 請求都會加上 token
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)selectWaveToken\s*=\s*([^;]*).*$)|^.*$/,
        '$1',
      );
      this.$http.defaults.headers.common.Authorization = token;
      // 檢查用戶是否仍持續登入API
      const api = `${import.meta.env.VITE_APP_API_URL}/api/auth/check`;
      this.$http.get(api, {
        headers: {
          Authorization: token,
        },
      })
        .then((response) => {
          if (response.data.status) {
            const { id } = response.data.result;
            this.memberId = id;
            this.getMemberInfo(this.memberId);
          } else {
            this.$swal({
              title: '登入失敗，請重新登入',
            });
            window.location.href = '/login';
          }
        })
        .catch((err) => {
          this.$swal({
            title: `${err.response.data.message}`,
          });
        });
    },
    uploadFile() {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)selectWaveToken\s*=\s*([^;]*).*$)|^.*$/,
        '$1',
      );
      this.$http.defaults.headers.common.Authorization = token;
      const authoToken = {
        headers: {
          Authorization: token,
        },
      };

      const uploadFile = this.$refs.fileInput.files[0];
      const formData = new FormData();
      formData.append('file-to-upload', uploadFile);

      const api = `${import.meta.env.VITE_APP_API_URL}/api/imgur/upload`;
      this.$http.post(api, formData, authoToken)
        .then((res) => {
          this.memberPerson.avatar = res.data.result;
          this.$swal({
            title: `${res.data.message}`,
          });
        })
        .catch((err) => {
          this.$swal({
            title: `${err.response.data.message}`,
          });
        });
    },
    getMemberInfo(id) {
      const apiUrl = `${import.meta.env.VITE_APP_API_URL}/api/member/${id}`;
      this.$http.get(apiUrl)
        .then((res) => {
          this.memberPerson = res.data.result;
          if (!this.memberPerson.socialMedia.length) {
            this.memberPerson.socialMedia.push(
              {
                type: 'Facebook',
                id: '',
              },
              {
                type: 'Instagram',
                id: '',
              },
              {
                type: 'YouTube',
                id: '',
              },
              {
                type: '個人網站',
                id: '',
              },
            );
          }
        })
        .catch((err) => {
          this.$swal({
            title: `${err.response.data.message}`,
          });
        });
    },
    updateMember() {
      const apiUrl = `${import.meta.env.VITE_APP_API_URL}/api/member/`;
      this.$http.put(apiUrl, this.memberPerson)
        .then((res) => {
          this.getMemberInfo(this.memberId);
          this.$swal({
            title: `${res.data.message}`,
          });
          window.location.reload();
        })
        .catch((err) => {
          this.$swal({
            title: `${err.response.data.message}`,
          });
        });
    },
    clickDate() {
      if (this.birthday) {
        const selectedDateTime = new Date(this.birthday);

        // 取得各部分日期時間的數值
        const year = selectedDateTime.getFullYear();
        const month = String(selectedDateTime.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDateTime.getDate()).padStart(2, '0');
        const hours = String(selectedDateTime.getHours()).padStart(2, '0');
        const minutes = String(selectedDateTime.getMinutes()).padStart(2, '0');
        const seconds = String(selectedDateTime.getSeconds()).padStart(2, '0');
        const milliseconds = String(selectedDateTime.getMilliseconds()).padStart(3, '0');
        // 生成格式化後的日期時間字串
        const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
        this.memberPerson.birthday = formattedDateTime;
      }
    },
  },
  watch: {
    memberPerson: {
      handler() {
        [this.birthday] = (this.memberPerson.birthday && this.memberPerson.birthday.split('T')) || '';
      },
      deep: true,
    },
  },
  mounted() {
    this.getToken();
  },
};
</script>
