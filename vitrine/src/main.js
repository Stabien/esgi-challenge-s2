import './index.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { setLogo } from '@/utils';
// import { Tracker } from 'tracker-vite';
import Tracker from '@/utils/Tracker.vue';

setLogo();

const app = createApp(App);
app.use(Tracker, {
  App_id: 'azertyuiop1234567890'
});
app.use(router).mount('#app');
