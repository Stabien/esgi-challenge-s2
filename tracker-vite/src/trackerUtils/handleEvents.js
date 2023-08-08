import { getURL } from './handleUrl';

export const exportData = async (
  { appId, event, url, sessionId, htmlElement, directiveTag, timestamp },
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
        timestamp
      }),
      headers
    };
    const response = await fetch(
      `${import.meta.env.VITE_PROD_API_URL}/api/analytics/add`,
      requestOptions
    );
    if (!response.ok) throw new Error('Something went wrong');
    socket.emit('newDataAdded');
  } catch (error) {
    console.log(error);
  }
};

export const handleEvent = (element, eventName, directiveBindingArgument, APP_ID, socket) => {
  const htmlElement = element.tagName;
  exportData(
    {
      appId: APP_ID,
      event: eventName,
      url: getURL(),
      sessionId: window.localStorage.getItem('Session_ID'),
      htmlElement: htmlElement,
      directiveTag: directiveBindingArgument,
      timestamp: Date.now()
    },
    socket
  );
};
