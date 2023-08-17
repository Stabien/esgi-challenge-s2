import { exportData } from './handleEvents';
import { getURL } from './handleUrl';
import { itemExistsInLocalStorage } from './utils';

export const setSessionID = (APP_ID, socket) => {
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

export const handleSessionId = (APP_ID, socket) => {
  window.localStorage.setItem('url', getURL());

  if (!itemExistsInLocalStorage('Session_ID')) {
    window.localStorage.setItem('Session_ID', Math.floor(Math.random() * Date.now()).toString(36));
    setSessionID(APP_ID, socket);
  }
};

export const handleRefresh = (APP_ID, socket) => {
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
