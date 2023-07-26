<script>
import {ref} from "vue";

    function handleURL() {
        checkUrls()
    }

    function checkUrls() {
      console.log('check url')
      if(window.localStorage.getItem('url') === getURL()) {
        return;
      }
      window.localStorage.setItem('url', getURL());
      console.log('url changed')
    }

    function getURL() {
      return window.location.pathname
    }

    export default {
    install(VueInstance, options) {

      let tagName
      let parentTagName
      let tagId
      let darkTheme
      let timestamp
      let APP_ID = options.App_id
      const mouseX = ref(0)
      const mouseY = ref(0)


      window.localStorage.setItem('url', getURL());
      window.localStorage.setItem('Session_ID', setSessionID())

      function getHostName(){
        return window.location.hostname;
      }

      function setSessionID() {
        /* Trigger aux changement des conditions */
        let session_id = Math.floor(Math.random() * Date.now()).toString(36);
        console.log(session_id)
        return Math.floor(Math.random() * Date.now()).toString(36);
      }



      function checkHostName(el) {
        if (!el.hostname === getHostName()) {
          return false
        }
        return true
      }

      function handleEvent(e, element, eventName) {
        timestamp = Date.now()
        tagName = element.tagName;
        parentTagName = element.parentElement.tagName
        tagId = element.id
        handleURL()
        console.log(`Directive triggered on tag ${tagName} with id with modifier/event
      ${eventName} at ${Date.now()} at page ${getURL()}. Session id is ${window.localStorage.getItem('Session_ID')} and App id is
      ${APP_ID}`)
      }

      function handleMouse(element, e) {
        if (e.clientX < window.innerWidth - 16 / 2) mouseX.value = e.clientX
        if (e.clientY < window.innerHeight - 16 / 2) mouseY.value = e.clientY
        console.log(`X: ${mouseX.value} ; Y: ${mouseY.value}`)
      }

    VueInstance.directive('track', {
    mounted: (el, binding) => {
    Object.entries(binding.modifiers).forEach(function (modifier) {
    el.addEventListener(`${modifier[0]}`, (e) => handleEvent(e, el, modifier[0]))
})
}
})

    VueInstance.directive('mouse', {
    mounted: (el) => {
    el.addEventListener('mousemove', (e) => {
    handleMouse(el, e)
})
}
})
},
}
</script>