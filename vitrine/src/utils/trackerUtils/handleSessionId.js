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
