<script>
const exportData = async ({
  appId,
  event,
  url,
  sessionId,
  htmlElement,
  directiveTag,
  timestamp,
}) => {
  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    var requestOptions = {
      method: "POST",
      body: JSON.stringify({
        appId,
        event,
        url,
        sessionId,
        htmlElement,
        directiveTag,
        timestamp,
      }),
      headers,
    };
    const response = await fetch(
      `${import.meta.env.VITE_PROD_API_URL}/api/analytics/add`,
      requestOptions
    );
    if (!response.ok) throw new Error("Something went wrong");
    // const data = await response.json();
    // updateLocalStorage('token', props.isAdmin ? data.admin.token : data.user.token);
  } catch (error) {
    console.log(error);
  }
};

function handleURL() {
  checkUrls();
}

function checkUrls() {
  if (window.localStorage.getItem("url") !== getURL())
    window.localStorage.setItem("url", getURL());
}

function getURL() {
  return window.location.pathname;
}

function setSessionID(APP_ID) {
  /* Trigger aux changement des conditions */
  let SessionId = window.localStorage.getItem("Session_ID");
  exportData({
    appId: APP_ID,
    event: "newSession",
    url: getURL(),
    sessionId: SessionId,
    htmlElement: "none",
    directiveTag: "none",
    timestamp: Date.now(),
  });
  return SessionId;
}

function handleEvent(element, eventName, directiveBindingArgument, APP_ID) {
  const htmlElement = element.tagName;
  // const tagId = element.id;
  handleURL();
  exportData({
    appId: APP_ID,
    event: eventName,
    url: getURL(),
    sessionId: window.localStorage.getItem("Session_ID"),
    htmlElement: htmlElement,
    directiveTag: directiveBindingArgument,
    timestamp: Date.now(),
  });
}
// const mouseX = ref(0);
// const mouseY = ref(0);
// function handleMouse(element, e, bArg) {
//   if (e.clientX < window.innerWidth - 16 / 2) mouseX.value = e.clientX;
//   if (e.clientY < window.innerHeight - 16 / 2) mouseY.value = e.clientY;
// }

window.localStorage.setItem("url", getURL());
// if (!window.localStorage.getItem('Session_ID')) {
//   const token = jwt_decode(localStorage.getItem('token'));
//   if (token) {
//     console.log(token);
//     window.localStorage.setItem('Session_ID', setSessionID(token.token.appId));
//   }
// }

window.addEventListener("unload", () => {
  console.log("je unload");
  // window.localStorage.removeItem('Session_ID');
});
// window.localStorage.setItem('url', getURL());
// window.localStorage.setItem('Session_ID', setSessionID(APP_ID));

const itemExistsInLocalStorage = (key) => {
  const value = localStorage.getItem(key);
  return value !== null;
};

export default {
  install(VueInstance, options) {
    let APP_ID = options.App_id;
    if (!itemExistsInLocalStorage("Session_ID")) {
      window.localStorage.setItem(
        "Session_ID",
        Math.floor(Math.random() * Date.now()).toString(36)
      );
      setSessionID(APP_ID);
    }
    VueInstance.provide("app_id", APP_ID);

    VueInstance.directive("track", {
      mounted: (el, binding) => {
        Object.entries(binding.modifiers).forEach(function (modifier) {
          el.addEventListener(`${modifier[0]}`, () =>
            handleEvent(el, modifier[0], binding.arg, APP_ID)
          );
        });
      },
    });

    VueInstance.directive("mouse", {
      mounted: () => {},
    });
  },
};
</script>
