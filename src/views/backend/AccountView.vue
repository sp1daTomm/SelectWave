<template>
  <Navbar />
  <NavbarBackend />
  <NavbarVote />
  <div class="max-w-screen-lg mx-auto px-3">
    <div class="outline outline-1 outline-gray-3 rounded-2xl md:rounded-3xl
    py-11 px-5 mb-10">
      <div class="flex justify-between mb-7 md:mb-8 max-w-3xl mx-auto">
        <button type="button" class="px-6 py-3 flex items-center justify-center rounded-3xl bg-white
          text-gray-1 text-base font-medium outline outline-2 outline-gray-1
          hover:outline-primary hover:text-primary">
          換成頭像
        </button>
        <button type="button" class="px-6 py-3 flex items-center justify-center rounded-3xl border-2
          border-gray-1 bg-white text-gray-1 text-base font-medium hover:text-primary hover:border-primary"
          @click="$refs.DelModal.openModal()">
          刪除帳號
        </button>
      </div>
      <form class="max-w-3xl mx-auto">
        <div class="mb-4">
          <label for="name" class="block mb-2 text-base font-medium text-gray-1">名稱*</label>
          <input type="text" id="name" class="bg-white border border-gray-3 text-sm rounded-3xl
              focus:ring-primary focus:border-primary block w-full px-3 py-4" placeholder="顯示註冊填寫的名稱" required />
        </div>
        <div class="mb-4">
          <label for="email" class="block mb-2 text-base font-medium text-gray-1">Email*</label>
          <input type="email" id="email" class="bg-white border border-gray-3 text-sm rounded-3xl
              focus:ring-primary focus:border-primary block w-full px-3 py-4" placeholder="xxx@gmail.com" required />
          <p class="mt-2 text-sm text-gray-2">信箱已驗證成功。若修改信箱，新信箱須重新驗證後才會儲存。</p>
        </div>
        <div class="mb-4">
          <label for="sex" class="block mb-2 text-base font-medium text-gray-1">性別*</label>
          <select id="sex"
            class="bg-white border border-gray-300 text-gray-900 text-sm  rounded-3xl focus:ring-primary focus:border-primary block w-full px-3 py-4">
            <option selected>請選擇性別</option>
            <option value="male">男</option>
            <option value="female">女</option>
            <option value="nodisclose">不方便透露</option>
          </select>
        </div>
        <div class="mb-4">
          <label for="birthday" class="block mb-2 text-base font-medium text-gray-1">生日</label>
          <input type="date" id="birthday" class="bg-white border border-gray-3 text-sm rounded-3xl
              focus:ring-primary focus:border-primary block w-full px-3 py-4" required />
        </div>
        <div class="mb-4">
          <label for="facebookUrl" class="block mb-2 text-base font-medium text-gray-1">Facebook 社群連結</label>
          <input type="url" id="facebookUrl" class="bg-white border border-gray-3 text-sm rounded-3xl
              focus:ring-primary focus:border-primary block w-full px-3 py-4" placeholder="請填入社群網址" required />
        </div>
        <div class="mb-4">
          <label for="instagramUrl" class="block mb-2 text-base font-medium text-gray-1">Instagram 社群連結</label>
          <input type="url" id="instagramUrl" class="bg-white border border-gray-3 text-sm rounded-3xl
              focus:ring-primary focus:border-primary block w-full px-3 py-4" placeholder="請填入社群網址" required />
        </div>
        <div class="mb-4">
          <label for="youtubeUrl" class="block mb-2 text-base font-medium text-gray-1">YouTube 社群連結</label>
          <input type="url" id="youtubeUrl" class="bg-white border border-gray-3 text-sm rounded-3xl
              focus:ring-primary focus:border-primary block w-full px-3 py-4" placeholder="請填入社群網址" required />
        </div>
        <div class="mb-6">
          <label for="personalUrl" class="block mb-2 text-base font-medium text-gray-1">個人網站連結</label>
          <input type="url" id="personalUrl" class="bg-white border border-gray-3 text-sm rounded-3xl
              focus:ring-primary focus:border-primary block w-full px-3 py-4" placeholder="請填入社群網址" required />
        </div>
        <button type="submit" class="text-white bg-gray-1 hover:bg-primary focus:ring-4
            focus:outline-none focus:ring-primary-light font-medium rounded-3xl
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
import NavbarVote from '@/components/backend/NavbarVote.vue';
import ComponentFooter from '@/components/ComponentFooter.vue';
import Navbar from '@/components/NavbarEl.vue';

export default {
  components: {
    Navbar,
    NavbarBackend,
    NavbarVote,
    ComponentFooter,
    DelModal,
  },
  data() {
    return {
      delContent: '「此帳號後，需重新建立帳號」',
    };
  },
};
</script>

<style scoped></style>
