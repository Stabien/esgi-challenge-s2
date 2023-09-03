import { setSessionID } from './handleSessionId';

export const itemExistsInLocalStorage = (key) => {
  const value = localStorage.getItem(key);
  return value !== null;
};
export const checkInactivity = (APP_ID, socket) => {
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
