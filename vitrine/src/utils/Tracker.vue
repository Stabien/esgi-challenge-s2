<script>
import { handleURL, handleEvent, checkInactivity, handleSessionId } from './trackerUtils';
import { io } from 'socket.io-client';

export default {
  install(VueInstance, options) {
    let APP_ID = options.App_id;
    // socket io connection
    const socket = io(import.meta.env.VITE_PROD_API_URL);
    socket.on('connect', () => {
      socket.emit('connectedWithAppId', { appId: APP_ID });
    });
    socket.on('message', (arg) => {
      console.log(arg); // world
    });

    checkInactivity(APP_ID, socket);

    handleSessionId(APP_ID, socket);

    setInterval(() => {
      handleURL(APP_ID, socket);
    }, 500);

    VueInstance.directive('track', {
      mounted: (el, binding) => {
        Object.entries(binding.modifiers).forEach(function (modifier) {
          el.addEventListener(`${modifier[0]}`, () =>
            handleEvent(el, modifier[0], binding.arg, APP_ID, socket)
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
