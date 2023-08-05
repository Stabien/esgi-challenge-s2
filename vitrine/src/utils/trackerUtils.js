import { io } from 'socket.io-client';

export const exportData = async ({
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

export const handleURL = (APP_ID) => {
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
};

export const getURL = () => {
  return window.location.pathname;
};

export const setSessionID = (APP_ID) => {
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
};

export const handleEvent = (element, eventName, directiveBindingArgument, APP_ID) => {
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
};
export const itemExistsInLocalStorage = (key) => {
  const value = localStorage.getItem(key);
  return value !== null;
};

export const checkInactivity = () => {
  let inactiveTimer;
  const inactivityTimeout = 3000; // Temps en millisecondes (30 secondes ici)

  function resetInactiveTimer() {
    clearTimeout(inactiveTimer);
    inactiveTimer = setTimeout(handleInactivity, inactivityTimeout);
  }

  function handleInactivity() {
    // Mettez ici le code à exécuter lorsque le site devient inactif
    console.log('Le site est inactif !');
  }

  // Écoutez les événements de souris et de clavier pour réinitialiser le minuteur
  window.addEventListener('mousemove', resetInactiveTimer);
  window.addEventListener('mousedown', resetInactiveTimer);
  window.addEventListener('keypress', resetInactiveTimer);
};

export const handleSessionId = (APP_ID) => {
  window.localStorage.setItem('url', getURL());

  window.addEventListener('close', () => {
    window.localStorage.removeItem('Session_ID');
  });

  if (!itemExistsInLocalStorage('Session_ID')) {
    window.localStorage.setItem('Session_ID', Math.floor(Math.random() * Date.now()).toString(36));
    setSessionID(APP_ID);
  }
};

export const handleSocketIo = (APP_ID) => {
  // socket io connection
  const socket = io(import.meta.env.VITE_PROD_API_URL);
  socket.on('connect', () => {
    socket.emit('connectedWithAppId', { appId: APP_ID });
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from Socket.IO server.');
  });

  socket.on('message', (arg) => {
    console.log(arg); // world
  });
};
