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
    // console.log('gonna fetch');
    // console.log({ appId, event, url, sessionId, htmlElement, directiveTag, timestamp });
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
  // console.log('check url');
  if (window.localStorage.getItem("url") === getURL()) {
    return;
  }
  window.localStorage.setItem("url", getURL());
  // console.log('url changed');
}

function getURL() {
  return window.location.pathname;
}

// function getHostName() {
//   return window.location.hostname;
// }

function setSessionID(APP_ID) {
  /* Trigger aux changement des conditions */

  let SessionId = Math.floor(Math.random() * Date.now()).toString(36);
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

// function checkHostName(el) {
//   if (!el.hostname === getHostName()) {
//     return false;
//   }
//   return true;
// }

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

// function handleTest(e, bArg) {
//   console.log(`Clicked on ${e.target.tagName} with arg ${bArg}`);
// }

export default {
  install(VueInstance, options) {
    let APP_ID = options.App_id;

    window.localStorage.setItem("url", getURL());
    window.localStorage.setItem("Session_ID", setSessionID(APP_ID));

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
      mounted: () => {
        // mounted: (el, binding) => {
        // console.log('mouse');
        // el.addEventListener('mousemove', (e) => {
        //   handleMouse(el, e, binding.arg);
        // });
      },
    });
    // VueInstance.directive('test', {
    //   mounted: (el, binding) => {
    //     console.log('test');
    //     el.addEventListener('click', (e) => {
    //       handleTest(e, binding.arg);
    //     });
    //   }
    // });
  },
};
</script>
