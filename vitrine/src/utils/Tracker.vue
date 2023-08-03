<script>
import { io } from 'socket.io-client';

export default {
  install(VueInstance, options) {
    let APP_ID = options.App_id;

    const exportData = async ({
      appId,
      event,
      url,
      sessionId,
      htmlElement,
      directiveTag,
      timestamp
    }) => {
      try {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let requestOptions = {
          method: 'POST',
          body: JSON.stringify({
            appId,
            event,
            url,
            sessionId,
            htmlElement,
            directiveTag,
            timestamp
          }),
          headers
        };
        const response = await fetch(
          `${import.meta.env.VITE_PROD_API_URL}/api/analytics/add`,
          requestOptions
        );
        if (!response.ok) throw new Error('Something went wrong');
        // const data = await response.json();
        // updateLocalStorage('token', props.isAdmin ? data.admin.token : data.user.token);
      } catch (error) {
        console.log(error);
      }
    };

    function handleURL(APP_ID) {
      setTimeout(() => {
        if (window.localStorage.getItem('url') !== getURL()) {
          window.localStorage.setItem('url', getURL());
          console.log(window.localStorage.getItem('url'));
          exportData({
            appId: APP_ID,
            event: 'navigation',
            url: getURL(),
            sessionId: window.localStorage.getItem('Session_ID'),
            htmlElement: 'none',
            directiveTag: 'none',
            timestamp: Date.now()
          });
        }
      }, 100);
    }

    function getURL() {
      return window.location.pathname;
    }

    function setSessionID(APP_ID) {
      /* Trigger aux changement des conditions */
      let SessionId = window.localStorage.getItem('Session_ID');
      console.log(SessionId);
      exportData({
        appId: APP_ID,
        event: 'newSession',
        url: getURL(),
        sessionId: SessionId,
        htmlElement: 'none',
        directiveTag: 'none',
        timestamp: Date.now()
      });
      return SessionId;
    }

    function handleEvent(element, eventName, directiveBindingArgument, APP_ID) {
      const htmlElement = element.tagName;
      exportData({
        appId: APP_ID,
        event: eventName,
        url: getURL(),
        sessionId: window.localStorage.getItem('Session_ID'),
        htmlElement: htmlElement,
        directiveTag: directiveBindingArgument,
        timestamp: Date.now()
      });
    }

    window.localStorage.setItem('url', getURL());

    window.addEventListener('close', () => {
      window.localStorage.removeItem('Session_ID');
    });

    const itemExistsInLocalStorage = (key) => {
      const value = localStorage.getItem(key);
      return value !== null;
    };

    if (!itemExistsInLocalStorage('Session_ID')) {
      window.localStorage.setItem(
        'Session_ID',
        Math.floor(Math.random() * Date.now()).toString(36)
      );
      setSessionID(APP_ID);
    }

    // socket io connection
    const socket = io('http://localhost:4000');
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
