<script>
import { io } from 'socket.io-client';
import {
  handleURL,
  getURL,
  setSessionID,
  handleEvent,
  itemExistsInLocalStorage
} from './trackerUtils';

export default {
  install(VueInstance, options) {
    let APP_ID = options.App_id;

    window.localStorage.setItem('url', getURL());

    window.addEventListener('close', () => {
      window.localStorage.removeItem('Session_ID');
    });

    if (!itemExistsInLocalStorage('Session_ID')) {
      window.localStorage.setItem(
        'Session_ID',
        Math.floor(Math.random() * Date.now()).toString(36)
      );
      setSessionID(APP_ID);
    }

    // socket io connection
    const socket = io(import.meta.env.VITE_PROD_API_URL);
    socket.on('connect', () => {
      console.log('Connected to Socket.IO server.');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server.');
    });

    setInterval(() => {
      handleURL(APP_ID);
    }, 500);

    VueInstance.directive('track', {
      mounted: (el, binding) => {
        Object.entries(binding.modifiers).forEach(function (modifier) {
          el.addEventListener(`${modifier[0]}`, () =>
            handleEvent(el, modifier[0], binding.arg, APP_ID)
          );
        });
      }
    });
    VueInstance.directive('mouse', {
      mounted: () => {}
    });
  }
};
</script>
