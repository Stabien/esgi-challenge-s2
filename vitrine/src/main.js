import './index.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
// import { Tracker } from 'tracker-vite';
import Tracker from '@/utils/Tracker.vue';

const app = createApp(App);
app.use(Tracker, {
  App_id: 'wq6yljUGIg'
});
app.use(router).mount('#app');
