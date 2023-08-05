<script>
import {
  handleURL,
  handleEvent,
  checkInactivity,
  handleSessionId,
  handleSocketIo
} from './trackerUtils';

export default {
  install(VueInstance, options) {
    let APP_ID = options.App_id;

    checkInactivity();

    handleSessionId(APP_ID);
    handleSocketIo(APP_ID);

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
