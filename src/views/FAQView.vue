<script setup>
import { inject, ref } from 'vue';
import { RouterLink } from 'vue-router';
import axios from 'axios';
import {
  FwbAccordion,
  FwbAccordionContent,
  FwbAccordionHeader,
  FwbAccordionPanel,
  FwbModal,
} from 'flowbite-vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import faqData from '@/data/faq.json';

const { header, questions } = faqData;

const isShowModal = ref(false);

function closeModal() {
  isShowModal.value = false;
}
function showModal() {
  isShowModal.value = true;
}

const swal = inject('$swal');

const apiUrl = import.meta.env.VITE_APP_API_URL;
const mailTo = import.meta.env.VITE_APP_MAIL_TO;

const validationSchema = yup.object({
  name: yup.string().required('請輸入您的姓名'),
  email: yup.string().email('請輸入正確的Email格式 example@example.com').required('請輸入您的E-Mail'),
  message: yup.string().required('請輸入您的訊息'),
  quests: yup.array().min(),
  agree: yup.boolean().oneOf([true], '請同意隱私權政策'),
});

const {
  errors, defineField, values, resetForm,
} = useForm({
  initialValues: {
    name: '',
    email: '',
    message: '',
    quests: [],
    agree: false,
  },
  validationSchema,
});

const [name, nameAttrs] = defineField('name');
const [email, emailAttrs] = defineField('email');
const [message, messageAttrs] = defineField('message');
const [quests, questsAttrs] = defineField('quests');
const [agree, agreeAttrs] = defineField('agree');

const onSubmit = (async () => {
  try {
    const result = await axios.post(`${apiUrl}/api/mail/contact`, {
      form: values.email,
      to: mailTo || 'selectwave.supp@gmail.com',
      subject: '聯絡我們 - 選集客戶幫助中心',
      text: '您有一封新的聯絡我們信件',
      html: `
          <h1>您有一封新的聯絡我們信件</h1>
          <p>使用者姓名: ${values.name}</p>
          <p>使用者E-Mail: ${values.email}</p>
          <p>使用者對我們的訊息: ${values.message}</p>
          <p>使用者所選擇問題類型: ${values.quests.join(', ')}</p>
        `,
    });
    if (result.data.status) {
      swal('信件已成功寄出');
      resetForm();
      closeModal();
    }
  } catch (error) {
    swal('信件寄出失敗', error.response.data.message);
  }
});

const userData = ref([
  {
    type: 'text',
    name: 'name',
    label: '您的姓名',
    model: name,
    bind: nameAttrs,
  },
  {
    type: 'email',
    name: 'email',
    label: '您的E-Mail',
    model: email,
    bind: emailAttrs,
  },
  {
    type: 'textarea',
    name: 'message',
    label: '您想對我們說的',
    model: message,
    bind: messageAttrs,
  },
  {
    type: 'checkbox',
    name: 'questions',
    label: '問題類型',
    model: quests,
    bind: questsAttrs,
    list: [
      {
        title: '意見提供',
        value: '意見提供',
      },
      {
        title: '業務合作',
        value: '業務合作',
      },
      {
        title: '網站問題',
        value: '網站問題',
      },
      {
        title: '加入我們',
        value: '加入我們',
      },
    ],
  },
]);

</script>

<template>
  <main class="container max-w-screen-lg mx-auto">
    <div class="flex flex-col gap-12 py-16">
      <section class="flex flex-col md:flex-row-reverse md:items-center">
        <img src="/img_components/about-header-desktop.svg" alt="About us" class="hidden w-1/2 h-auto md:block md:-ml-48 md:-z-10" />
        <img src="/img_components/about-header-mobile.svg" alt="About us" class="w-full h-auto md:hidden" />
        <div class="flex flex-col gap-5 md:px-16 md:py-28">
          <h1 class="text-2xl font-bold">{{ header.title }}</h1>
          <div class="space-y-6">
            <p v-for="content in header.content" :key="content" class="md:text-lg">
              {{ content }}
            </p>
            <input type="button" value="聯絡我們" class="w-full px-6 py-3 text-white transition duration-300 rounded-full bg-primary-dark hover:bg-primary hover:cursor-pointer" @click="showModal" />
          </div>
        </div>
      </section>
      <fwb-accordion flush>
      <fwb-accordion-panel v-for="item in questions" :key="item">
        <fwb-accordion-header id="accordion-flush-heading-1">
            <span>{{ item.title }}</span>
        </fwb-accordion-header>
        <fwb-accordion-content>
          <p class="flex items-center gap-4 mb-2 text-gray-500 dark:text-gray-400" v-for="content in item.content" :key="content">
            <i class="w-5 h-5 bi bi-asterisk shrink-0 text-primary" />
            {{ content }}
          </p>
        </fwb-accordion-content>
      </fwb-accordion-panel>
      </fwb-accordion>
    </div>
    <fwb-modal v-if="isShowModal" @close="closeModal" size="7xl">
      <template v-slot:body>
        <div class="flex flex-col items-center gap-12 md:flex-row-reverse md:justify-between md:px-20">
          <div class="md:mr-12">
            <img src="/img_components/contact-header.svg" alt="Contact us" class="h-auto w-96" />
          </div>
          <section class="flex flex-col gap-6 md:w-1/2">
            <div class="flex flex-col gap-5">
              <h2 class="text-2xl font-bold">聯絡我們</h2>
              <p>
                在「選集」，我們一直在聆聽。<br /><br />
                無論您有任何問題、建議，或是需要協助，我們的團隊隨時準備為您提供支援。您的意見對我們來說非常寶貴，是我們不斷進步與成長的動力。
              </p>
            </div>
            <form class="flex flex-col gap-6" @submit="onSubmit">
              <div v-for="item in userData" :key="item">
                  <label v-if="item.type !== 'checkbox'" :for="item.value" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ item.label }}</label>
                  <input :type="item.type" v-if="item.type === 'text' || item.type === 'email'" :id="item.value" v-model="item.model" v-bind="item.bind" class="block w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-full bg-gray-50 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary" required />
                  <textarea v-if="item.type === 'textarea'" :id="item.value" :rows="8" v-model="item.model" v-bind="item.bind" class="block w-full p-3 text-sm text-gray-900 border border-gray-300 bg-gray-50 rounded-2xl focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary" placeholder="告訴我們些什麼...." required />
                  <div v-if="item.type === 'checkbox'" class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-gray-900 dark:text-white">問題類型</label>
                    <div class="flex flex-wrap gap-4">
                      <div v-for="list in item.list" :key="list">
                        <input :type="item.type" :id="list.value" :value="list.value" v-model="quests" v-bind="questsAttrs" class="mr-3 text-primary focus:ring-primary" />
                        <label :for="list.value" class="text-sm text-gray-900 dark:text-white">{{ list.title }}</label>
                      </div>
                    </div>
                  </div>
                  <p class="text-red-500" v-if="errors[item.name]">{{ errors[item.name] }}</p>
              </div>
              <div>
                <input type="checkbox" id="agree" v-model="agree" v-bind="agreeAttrs" class="text-primary focus:ring-primary" required />
                <label for="agree" class="text-sm">
                  我同意選集的
                  <RouterLink to="privacy" class="underline hover:text-primary">隱私權政策</RouterLink>
                </label>
                <p class="text-red-500" v-if="errors.agree">{{ errors.agree }}</p>
              </div>
              <input type="submit" value="送出" class="px-6 py-3 text-white transition duration-300 rounded-full bg-primary-dark hover:bg-primary hover:cursor-pointer" />
            </form>
          </section>
        </div>
      </template>
    </fwb-modal>
  </main>

</template>
