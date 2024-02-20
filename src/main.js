import { createApp } from 'vue';
import VueAxios from 'vue-axios';
import VueSweetalert2 from 'vue-sweetalert2';
import axios from 'axios';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/main.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const app = createApp(App);

app.use(VueSweetalert2);
app.use(createPinia());
app.use(router);
app.use(VueAxios, axios);
app.mount('#app');
