<script>
// import { handleURL, handleEvent, checkInactivity, handleSessionId } from './trackerUtils';
// import { handleEvent, exportData } from './trackerUtils/handleEvents.js';
import { io } from 'socket.io-client';

export default {
  install(VueInstance, options) {
    let APP_ID = options.App_id;
    // socket io connection
    const socket = io(import.meta.env.VITE_PROD_API_URL);
    socket.on('connect', () => socket.emit('connectedWithAppId', { appId: APP_ID }));

    const getURL = () => {
      return window.location.pathname;
    };
    const itemExistsInLocalStorage = (key) => {
      const value = localStorage.getItem(key);
      return value !== null;
    };
    const checkInactivity = (APP_ID, socket) => {
      let isInactive = false;
      let inactiveTimer;
      const inactivityTimeout = 1800000; // Time in milliseconds (30 minutes here)

      function resetInactiveTimer() {
        clearTimeout(inactiveTimer);
        inactiveTimer = setTimeout(handleInactivity, inactivityTimeout);
        if (isInactive) {
          window.localStorage.setItem(
            'Session_ID',
            Math.floor(Math.random() * Date.now()).toString(36)
          );
          setSessionID(APP_ID, socket);
          isInactive = false;
        }
      }

      function handleInactivity() {
        // Mettez ici le code à exécuter lorsque le site devient inactif
        console.log('Le site est inactif !');
        isInactive = true;
      }

      // Écoutez les événements de souris et de clavier pour réinitialiser le minuteur
      window.addEventListener('mousemove', resetInactiveTimer);
      window.addEventListener('mousedown', resetInactiveTimer);
      window.addEventListener('keypress', resetInactiveTimer);
    };

    const setSessionID = (APP_ID, socket) => {
      /* Trigger aux changement des conditions */
      let SessionId = window.localStorage.getItem('Session_ID');
      exportData(
        {
          appId: APP_ID,
          event: 'newSession',
          url: getURL(),
          sessionId: SessionId,
          htmlElement: 'none',
          directiveTag: 'none',
          timestamp: Date.now()
        },
        socket
      );

      return SessionId;
    };
    const handleSessionId = (APP_ID, socket) => {
      window.localStorage.setItem('url', getURL());

      if (!itemExistsInLocalStorage('Session_ID')) {
        window.localStorage.setItem(
          'Session_ID',
          Math.floor(Math.random() * Date.now()).toString(36)
        );
        setSessionID(APP_ID, socket);
      }
    };

    const handleRefresh = (APP_ID, socket) => {
      window.addEventListener('load', () => {
        if (window.localStorage) {
          var t0 = Number(window.localStorage['myUnloadEventFlag']);
          if (isNaN(t0)) t0 = 0;
          var t1 = new Date().getTime();
          var duration = t1 - t0;
          if (duration < 10 * 1000) {
            // console.log('reload');
          } else {
            // console.log('close');
            // more than 10 seconds since the previous Unload event => it's a browser close
            //REMOVE SESSION ID
            window.localStorage.removeItem('Session_ID');
            window.localStorage.setItem(
              'Session_ID',
              Math.floor(Math.random() * Date.now()).toString(36)
            );
            setSessionID(APP_ID, socket);
          }
        }
      });
      window.addEventListener('beforeunload', () => {
        if (window.localStorage) window.localStorage['myUnloadEventFlag'] = new Date().getTime();
      });
    };

    const exportData = async (
      { appId, event, url, sessionId, htmlElement, directiveTag, timestamp, x, y },
      socket
    ) => {
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
            timestamp,
            x,
            y
          }),
          headers
        };
        await fetch(`${import.meta.env.VITE_PROD_API_URL}/api/analytics/add`, requestOptions);
        socket.emit('newDataAdded');
      } catch (error) {
        console.log(error);
      }
    };

    const handleEvent = (element, eventName, directiveBindingArgument, APP_ID, socket, event) => {
      const htmlElement = element.tagName;
      exportData(
        {
          appId: APP_ID,
          event: eventName,
          url: getURL(),
          sessionId: window.localStorage.getItem('Session_ID'),
          htmlElement: htmlElement,
          directiveTag: directiveBindingArgument,
          timestamp: Date.now(),
          x: eventName === 'click' ? event.pageX : undefined,
          y: eventName === 'click' ? event.pageY : undefined
        },
        socket
      );
    };

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
