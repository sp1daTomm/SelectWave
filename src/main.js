import { createApp } from 'vue';
import VueSweetalert2 from 'vue-sweetalert2';
import { createPinia } from 'pinia';
import * as v from 'valibot';
import App from './App.vue';
import router from './router';
import './assets/main.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import '@valibot/i18n';

v.setGlobalConfig({ lang: 'zh-TW' });

const app = createApp(App);

app.use(VueSweetalert2);
app.use(createPinia());
app.use(router);

app.mount('#app');
