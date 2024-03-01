<template>
  <Navbar />
  <NavbarBackend />
  <div class="max-w-screen-lg mx-auto px-3">
    <div class="outline outline-1 outline-gray-3 rounded-2xl md:rounded-3xl
    py-11 px-5 mb-10">
      <div class="flex justify-between mb-7 md:mb-8 max-w-3xl mx-auto">
        <button type="button" class="px-6 py-3 flex items-center justify-center rounded-full bg-white
          text-gray-1 text-base font-medium outline outline-2 outline-gray-1
          hover:outline-primary hover:text-primary">
          換成頭像
        </button>
        <button type="button" class="px-6 py-3 flex items-center justify-center rounded-full border-2
          border-gray-1 bg-white text-gray-1 text-base font-medium hover:text-primary hover:border-primary"
          @click="$refs.DelModal.openModal()">
          刪除帳號
        </button>
      </div>
      <form class="max-w-3xl mx-auto" @submit.prevent="updateMember">
        <div class="mb-4">
          <label for="name" class="block mb-2 text-base font-medium text-gray-1">名稱</label>
          <input type="text" id="name" class="bg-white border border-gray-3 text-sm rounded-full
              focus:ring-primary focus:border-primary block w-full px-3 py-4" v-model="memberPerson.name" />
        </div>
        <div class="mb-4">
          <label for="sex" class="block mb-2 text-base font-medium text-gray-1">性別</label>
          <select id="sex"
            class="bg-white border border-gray-300 text-gray-900 text-sm  rounded-full focus:ring-primary focus:border-primary block w-full px-3 py-4"
            v-model="memberPerson.gender">
            <option value="" selected disabled>請選擇性別</option>
            <option value="male">男</option>
            <option value="female">女</option>
            <option value="x">不方便透露</option>
          </select>
        </div>
        <div class="mb-4">
          <label for="birthday" class="block mb-2 text-base font-medium text-gray-1">生日</label>
          <input v-if="!memberPerson.birthday"
          type="date" id="birthday" class="bg-white border border-gray-3 text-sm rounded-full
              focus:ring-primary focus:border-primary block w-full px-3 py-4"
              v-model="birthday"
              @input="clickDate" />
          <input v-else type="date" id="birthday" class="bg-white border border-gray-3 text-sm rounded-full
          focus:ring-primary focus:border-primary block w-full px-3 py-4"
          v-model="birthday"
          @input="clickDate" />
        </div>
        <div class="mb-4" v-for="(item, index) in memberPerson.socialMedia" :key="index">
          <label for="facebookUrl" class="block mb-2 text-base font-medium text-gray-1">
            {{ memberPerson.socialMedia[index].type }} 社群連結
          </label>
          <input type="url" class="bg-white border border-gray-3 text-sm rounded-full
              focus:ring-primary focus:border-primary block w-full px-3 py-4 mb-2" placeholder="請填入社群網址"
            v-model="memberPerson.socialMedia[index].id" />
        </div>
        <button type="submit" class="text-white bg-gray-1 hover:bg-primary focus:ring-4
            focus:outline-none focus:ring-primary-light font-medium rounded-full
            text-base w-full sm:w-auto px-5 py-2.5 text-center">
          更新
        </button>
      </form>
    </div>
  </div>
  <DelModal ref="DelModal" :delContent="delContent"></DelModal>
  <ComponentFooter></ComponentFooter>
</template>
<script>
import DelModal from '@/components/backend/DelModal.vue';
import NavbarBackend from '@/components/backend/NavbarBackend.vue';
import ComponentFooter from '@/components/ComponentFooter.vue';
import Navbar from '@/components/NavbarEl.vue';

export default {
  components: {
    Navbar,
    NavbarBackend,
    ComponentFooter,
    DelModal,
  },
  data() {
    return {
      delContent: '「此帳號後，需重新建立帳號」',
      memberId: '',
      memberPerson: { // 根據ID獲取會員詳細資料
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
            this.$router.push('/login');
          }
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
        [this.birthday] = this.memberPerson.birthday.split('T');
      },
      deep: true,
    },
  },
  mounted() {
    this.getToken();
  },
};
</script>

<style scoped></style>
