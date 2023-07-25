import './index.css';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { setLogo } from '@/utils';
import Toast from 'vue-toastification';
// Import the CSS or use your own!
import 'vue-toastification/dist/index.css';

setLogo();

const app = createApp(App);
const toastOptions = {
  position: 'bottom-right',
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: 'button',
  icon: true,
  rtl: false
};
app.use(Toast, toastOptions).use(router).mount('#app');
