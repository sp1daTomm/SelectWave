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
  errors, defineField, values, resetForm, meta,
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
      <div class="max-w-3xl">
        <h1 class="mb-5 text-4xl font-bold md:mb-6">{{ headers.title }}</h1>
        <p class="mb-12 text-lg leading-normal md:mb-20">
          {{ headers.content }}
        </p>
      </div>
      <ul>
        <li v-for="feature in features" :key="feature.title" class="flex flex-col gap-6 pt-8 border-t md:grid md:grid-cols-2 md:items-center md:gap-20">
          <img :src="feature.imageUrl" :alt="feature.title" class="w-full h-auto mb-4" />
          <div class="space-y-2">
            <h2 class="mb-2 text-2xl font-bold">{{ feature.title }}</h2>
            <p class="text-lg leading-normal">{{ feature.content }}</p>
          </div>
        </li>
      </ul>
    </section>
    <section class="flex flex-col gap-12 px-5 py-16 md:gap-10 md:px-16 md:py-28">
      <div>
        <h2 class="mb-5 text-4xl font-bold">{{ team.title }}</h2>
        <p class="mb-12 text-lg leading-normal">{{ team.content }}</p>
      </div>
      <ul class="flex flex-col gap-12 md:grid md:grid-cols-2 md:gap-16">
        <li v-for="member in team.members" :key="member.name" class="flex flex-col items-center gap-2 md:gap-8 md:flex-row md:items-start">
          <img :src="member.imageUrl" :alt="member.name" class="object-cover w-3/4 md:w-1/2 aspect-square" />
          <div class="flex flex-col gap-5 md:gap-6">
            <div>
              <h3 class="text-xl font-bold">{{ member.name }}</h3>
              <p class="mb-3 text-lg leading-normal md:mb-4">{{ member.title }}</p>
              <p class="text-lg leading-normal">{{ member.content }}</p>
            </div>
            <ul class="flex items-center gap-4">
              <li class="grid w-6 h-6 place-content-center" v-for="item in member.socialMedia" :key="item.type">
                <a class="inline-block w-6 h-6" v-if="item.type !== 'email'" :href="item.url" target="_blank" rel="noopener noreferrer">
                  <i :class="`text-2xl leading-none bi ${item.icon}`" />
                </a>
                <a class="inline-block w-6 h-6" :href="item.url" v-else>
                  <i :class="`text-2xl leading-none bi ${item.icon}`" />
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
    <section class="flex flex-col items-center justify-center px-5 py-16 mb-6 md:px-16 md:py-28">
      <div class="p-8 space-y-6 rounded-2xl bg-gray-4 md:grid md:grid-cols-2 md:gap-20 md:w-full md:items-center">
        <div class="flex flex-col gap-3">
          <h2 class="mb-5 text-4xl font-bold">訂閱電子報</h2>
          <p>獲取最新資訊與熱門的投票議題</p>
        </div>
        <div class="flex flex-col gap-6">
        <form class="flex flex-col gap-4 md:flex-row" :class="errors.email ? 'md:items-start' : 'md:items-center'" @submit.prevent="onSubmit">
            <div class="relative flex-auto">
              <input type="email" v-model="email" v-bind="emailAttrs" placeholder="輸入你的Email" :class="`w-full px-4 py-3 rounded-full ${ errors.email ? 'border-red-500 border-2 focus:border-red-500 focus:ring-red-500' : 'focus:ring-primary focus:ring-2 focus:border-primary' }`" required :disabled="isLoading" />
              <p class="absolute left-0 ml-4 text-red-500 top-full" v-if="errors.email">{{ errors.email }}</p>
            </div>
            <input type="submit" value="訂閱" :class="errors.email ? 'mt-4 md:mt-0' : ''" class="w-full px-6 py-3 text-white rounded-full md:w-auto bg-gray-1 disabled:opacity-50" :disabled="!meta.valid" />
          </form>
          <p>點擊訂閱表示您同意我們 <RouterLink to="/terms" class="underline transition duration-150 hover:text-primary" target="_blank">使用條款</RouterLink>與<RouterLink to="/privacy" class="underline transition duration-150 hover:text-primary" target="_blank">隱私政策</RouterLink>.</p>
        </div>
        </div>
    </section>
    <section class="flex flex-col items-center justify-center gap-12 py-16 md:py-28 md:gap-20 md:px-16">
      <div class="flex flex-col gap-8 md:gap-12">
        <div class="flex flex-col gap-6 pt-8 border-t md:grid md:grid-cols-2 md:items-center md:gap-20" v-for="service in services" :key="service.title">
          <div class="grid h-64 md:h-96 place-content-center">
            <img :src="service.imageUrl" :alt="service.title" class="object-cover h-24 md:h-48" />
          </div>
          <div class="flex flex-col gap-5 md:gap-4">
            <h2 class="mb-5 text-3xl font-bold md:text-4xl">{{ service.title }}</h2>
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
