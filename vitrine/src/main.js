import './index.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { setLogo } from '@/utils';
import Tracker from './utils/Tracker';

setLogo();

const app = createApp(App);
app.use(router).mount('#app');
app.use(Tracker);
