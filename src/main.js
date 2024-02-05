import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import VueSweetalert2 from 'vue-sweetalert2';
import App from './App.vue';
import router from './router';

import 'sweetalert2/dist/sweetalert2.min.css';

const app = createApp(App);

app.use(VueSweetalert2);
app.use(createPinia());
app.use(router);

app.mount('#app');
