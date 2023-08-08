import { exportData } from './handleEvents';

export const handleURL = (APP_ID, socket) => {
  if (window.localStorage.getItem('url') === getURL()) return;

  window.localStorage.setItem('url', getURL());
  exportData(
    {
      appId: APP_ID,
      event: 'navigation',
      url: getURL(),
      sessionId: window.localStorage.getItem('Session_ID'),
      htmlElement: 'none',
      directiveTag: 'none',
      timestamp: Date.now()
    },
    socket
  );
};

export const getURL = () => {
  return window.location.pathname;
};
