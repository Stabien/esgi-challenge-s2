<script>
// import { handleURL, handleEvent, checkInactivity, handleSessionId } from './trackerUtils';
import { checkInactivity } from './trackerUtils/utils';
import { handleEvent, exportData } from './trackerUtils/handleEvents.js';
import { handleSessionId, handleRefresh } from './trackerUtils/handleSessionId.js';
import { io } from 'socket.io-client';

export default {
  install(VueInstance, options) {
    let APP_ID = options.App_id;
    // socket io connection
    const socket = io(import.meta.env.VITE_PROD_API_URL);

    socket.on('connect', () => socket.emit('connectedWithAppId', { appId: APP_ID }));

    handleRefresh(APP_ID, socket);
    checkInactivity(APP_ID, socket);
    handleSessionId(APP_ID, socket);

    document.addEventListener('print', (data) => exportData(data.detail, socket));

    VueInstance.directive('track', {
      mounted: (el, binding) => {
        Object.entries(binding.modifiers).forEach(function (modifier) {
          el.addEventListener(`${modifier[0]}`, (event) =>
            handleEvent(el, modifier[0], binding.arg, APP_ID, socket, event)
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
