<script setup>
import { inject, ref } from 'vue';
import axios from 'axios';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import ContactFormModal from '@/components/ContactFormModal.vue';
import aboutData from '@/data/about.json';

const isLoading = ref(false);

const {
  headers, features, services, team,
} = aboutData;

const isShowModal = ref(false);

function closeModal() {
  isShowModal.value = false;
}
function showModal() {
  isShowModal.value = true;
}

const validationSchema = yup.object({
  email: yup.string().email('請輸入正確的Email格式 example@example.com').required('請輸入您的E-Mail'),
});

const {
  errors, defineField, values, resetForm,
} = useForm({
  initialValues: {
    email: '',
  },
  validationSchema,
});

const [email, emailAttrs] = defineField('email');

const swal = inject('$swal');

const onSubmit = (async () => {
  isLoading.value = true;
  try {
    const { data } = await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/contact/subscribe`, {
      email: values.email,
    });
    swal({
      title: '訂閱成功',
      text: data.message,
      icon: 'success',
    });
    resetForm();
    isLoading.value = false;
  } catch (error) {
    swal({
      title: '訂閱失敗',
      text: error.response.data.message,
      icon: 'error',
    });
    isLoading.value = false;
  }
});

</script>

<template>
  <main class="container py-6" :class="isShowModal && 'h-screen overflow-hidden'">
    <section class="py-12">
      <h1 class="mb-5 text-4xl font-bold">{{ headers.title }}</h1>
      <p class="mb-12 text-lg leading-normal">
        {{ headers.content }}
      </p>
      <ul>
        <li v-for="feature in features" :key="feature.title" class="flex flex-col gap-6 py-8 border-t md:flex-row md:items-center md:justify-between">
          <img :src="feature.imageUrl" :alt="feature.title" class="w-full h-auto mb-4" />
          <div class="space-y-2">
            <h2 class="mb-2 text-2xl font-bold">{{ feature.title }}</h2>
            <p class="text-lg leading-normal">{{ feature.content }}</p>
          </div>
        </li>
      </ul>
    </section>
    <section>
      <h2 class="mb-5 text-4xl font-bold">{{ team.title }}</h2>
      <p class="mb-12 text-lg leading-normal">{{ team.content }}</p>
      <ul class="flex flex-col gap-12 md:grid md:grid-cols-2 md:gap-16">
        <li v-for="member in team.members" :key="member.name" class="flex flex-col items-center gap-2 md:flex-row md:items-start">
          <img :src="member.imageUrl" :alt="member.name" class="object-cover w-3/4 aspect-square" />
          <div>
            <h3 class="text-xl font-bold">{{ member.name }}</h3>
            <p class="text-lg leading-normal">{{ member.title }}</p>
            <p class="text-lg leading-normal">{{ member.content }}</p>
            <ul class="flex items-center gap-4">
              <li v-for="item in member.socialMedia" :key="item">
                <a :href="item.url" target="_blank" rel="noopener noreferrer">
                  <i :class="`w-6 h-6 bi ${item.icon}`" />
                </a>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </section>
    <section class="flex flex-col items-center justify-center gap-6 px-5 py-16 mb-6 text-center">
      <div class="space-y-5">
        <h2 class="mb-5 text-4xl font-bold">我們的合作夥伴</h2>
        <p class="leading-normal">
          我們與政府、企業、非營利組織等合作夥伴共同推動投票文化的普及。
        </p>
      </div>
      <div class="flex flex-col gap-4">
        <button type="button" class="px-6 py-3 text-white rounded-full bg-gray-1" @click="showModal">
          加入我們
        </button>
      </div>
    </section>
    <section class="flex flex-col items-center justify-center px-5 py-16 mb-6">
      <div class="p-8 space-y-6 rounded-2xl bg-gray-4">
        <div class="flex flex-col gap-3">
          <h2 class="mb-5 text-4xl font-bold">訂閱電子報</h2>
          <p>獲取最新資訊與熱門的投票議題</p>
        </div>
        <form class="space-y-4" @submit.prevent="onSubmit">
          <div class="flex flex-col gap-6">
            <input type="email" v-model="email" v-bind="emailAttrs" placeholder="輸入你的Email" class="px-4 py-3 rounded-full" required :disabled="isLoading" />
            <p class="text-red-500" v-if="errors.email">{{ errors.email }}</p>
            <input type="submit" value="送出" class="px-6 py-3 text-white rounded-full bg-gray-1" />
          </div>
          <p>點擊訂閱表示您同意我們 <RouterLink to="/terms" class="underline transition duration-150 hover:text-primary" target="_blank">使用條款</RouterLink>與<RouterLink to="/privacy" class="underline transition duration-150 hover:text-primary" target="_blank">隱私政策</RouterLink>.</p>
        </form>
      </div>
    </section>
    <section class="flex flex-col items-center justify-center gap-8 py-16">
      <div class="flex flex-col gap-8 py-8 border-t md:gap-12" v-for="service in services" :key="service.title">
        <div class="space-y-6 md:flex md:justify-between md:items-center md:gap-20">
          <img :src="service.imageUrl" :alt="service.title" class="mx-auto md:grid md:place-content-center" />
          <div class="flex flex-col w-1/2 gap-5">
            <h2 class="mb-5 text-4xl font-bold">{{ service.title }}</h2>
            <ul class="space-y-4">
              <li class="flex items-center gap-4" v-for="content in service.content" :key="content">
                <i class="w-5 h-5 bi bi-asterisk shrink-0 text-primary" v-if="service.content.length > 1" />
                <p class="text-lg leading-normal">{{ content }}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </main>
  <ContactFormModal :isShowModal="isShowModal" :closeModal="closeModal" />
</template>
