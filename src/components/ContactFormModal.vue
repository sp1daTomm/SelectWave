<script setup>
import {
  defineProps, inject, onMounted, ref,
} from 'vue';
import { RouterLink } from 'vue-router';
import axios from 'axios';
import { useForm } from 'vee-validate';
import * as yup from 'yup';

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

const isLoading = ref(false);

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

const props = defineProps({
  isShowModal: Boolean,
  closeModal: Function,
});

const onSubmit = (async () => {
  isLoading.value = true;
  try {
    await axios.post(`${apiUrl}/api/contact/`, {
      email: values.email,
      name: values.name,
      message: values.message,
      quests: values.quests,
    });
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
      props.closeModal();
      isLoading.value = false;
    }
  } catch (error) {
    swal('信件寄出失敗', error.response.data.message);
    isLoading.value = false;
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

const clickOutsideModal = (event) => {
  if (event.target.dataset.modal === 'backdrop') {
    props.closeModal();
  }
};

const onEscape = (event) => {
  if ((event.key === 'Escape' || event.keyCode === 27) && props.isShowModal) {
    props.closeModal();
  }
};

onMounted(() => {
  window.addEventListener('keydown', onEscape);
});

</script>

<template>
  <Transition name="fade" :duration="550">
    <div v-if="props.isShowModal" data-modal="backdrop"
         class="fixed bg-gray-1/35 backdrop-blur z-50 w-full p-4
         overflow-x-hidden overflow-y-auto inset-0 h-[calc(100%-1rem)] max-h-full"
         :class="props.isShowModal ? '' : 'hidden'" @click="clickOutsideModal" @keydown.esc="props.isShowModal && props.closeModal()">
        <div id="modal" class="relative w-full max-w-screen-lg max-h-full mx-auto transition duration-300">

          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div class="flex items-center justify-between p-4 border-b rounded-t md:p-5 dark:border-gray-600">
              <button type="button"
              class="inline-flex items-center justify-center w-8 h-8 text-sm text-gray-400 bg-transparent rounded-lg hover:bg-gray-200 hover:text-gray-900 ms-auto dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="extralarge-modal" @click="props.closeModal">
              <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
              stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <div
        class="flex flex-col items-center gap-12 p-5 md:flex-row-reverse md:justify-between md:p-10">
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
              <label v-if="item.type !== 'checkbox'" :for="item.value"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{
                item.label }}</label>
                  <input :type="item.type" v-if="item.type === 'text' || item.type === 'email'"
                  :id="item.value" v-model="item.model" v-bind="item.bind"
                  class="block w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-full bg-gray-50 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                  required :disabled="isLoading" />
                  <textarea v-if="item.type === 'textarea'" :id="item.value" :rows="8"
                  v-model="item.model" v-bind="item.bind"
                  class="block w-full p-3 text-sm text-gray-900 border border-gray-300 bg-gray-50 rounded-2xl focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                  placeholder="告訴我們些什麼...." required :disabled="isLoading" />
                  <div v-if="item.type === 'checkbox'" class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-gray-900 dark:text-white">問題類型</label>
                    <div class="flex flex-wrap gap-4">
                      <div v-for="list in item.list" :key="list">
                        <input :type="item.type" :id="list.value" :value="list.value" v-model="quests"
                        v-bind="questsAttrs" class="mr-3 text-primary focus:ring-primary"
                        :disabled="isLoading" />
                        <label :for="list.value" class="text-sm text-gray-900 dark:text-white">{{
                          list.title }}</label>
                      </div>
                    </div>
                  </div>
                  <p class="text-red-500" v-if="errors[ item.name ]">{{ errors[ item.name ] }}</p>
                </div>
                <div>
                  <input type="checkbox" id="agree" v-model="agree" v-bind="agreeAttrs"
                  class="text-primary focus:ring-primary" required :disabled="isLoading" />
                  <label for="agree" class="text-sm">
                    我同意選集的
                    <RouterLink to="privacy" class="underline hover:text-primary">隱私權政策</RouterLink>
                  </label>
                  <p class="text-red-500" v-if="errors.agree">{{ errors.agree }}</p>
                </div>
                <input type="submit" value="送出"
                class="px-6 py-3 text-white transition duration-300 rounded-full bg-primary-dark hover:bg-primary hover:cursor-pointer"
                :disabled="isLoading" />
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>

.fade-enter-active, .fade-leave-active {
  transition: all 0.25s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.fade-leave-active {
  transition-delay: 0.25s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.fade-enter-active #modal, .fade-leave-active #modal {
  transition: all 0.3s ease-in-out;
}

.fade-enter-active #modal {
  transition-delay: 0.25s;
}

.fade-enter-from #modal, .fade-leave-to #modal {
  transform: translateY(-100%);
  opacity: 0.001;
}

</style>
