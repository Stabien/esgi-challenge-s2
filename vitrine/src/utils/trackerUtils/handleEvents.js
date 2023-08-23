import { getURL } from './handleUrl';

export const exportData = async (
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
    const response = await fetch(
      `${import.meta.env.VITE_PROD_API_URL}/api/analytics/add`,
      requestOptions
    );
    socket.emit('newDataAdded');
  } catch (error) {
    console.log(error);
  }
};

export const handleEvent = (
  element,
  eventName,
  directiveBindingArgument,
  APP_ID,
  socket,
  event
) => {
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
