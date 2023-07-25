let domain = getDomain();
let tagName
let parentTagName
let tagId
let tagValue
// let parentTagId
// let darkTheme
let connected
let timestamp
let directive = false


export default {
install(VueInstance) {
    VueInstance.directive('click', {
        mounted: (el) => {
            el.addEventListener('click', () => {
                handleClick(el)
                console.log(el)
            })
        }
    })

    VueInstance.directive('submit', {
        mounted: (el) => {
            el.addEventListener('submit', () => {
                handleSubmit(el)
            })
        }
    })
},
}

document.querySelector("body").addEventListener("click", (e) => handleClickExt(e.target))
document.querySelector("body").addEventListener("change", () => handleURL())

function handleURL() {
    checkUrls()
}

function handleClick(el) {
    timestamp = Date.now()
    console.log(timestamp)
    tagName = el.tagName;
    parentTagName = el.parentElement.tagName
    tagId = el.id
    directive = true;
        console.log(`Directive ? ${directive}`)
        switch (tagName) {
            // Fall through
            case "H1":
            case "H2":
            case "H3":
            case "HEADER":
                console.log("Titre ou header")
                console.log(`${tagId} clicked at ${timestamp}`)
                return;
            case "A": {
                if (!el.href.includes(getDomain())) {
                    console.log('Lien externe');
                    console.log(`${tagId} clicked at ${timestamp}`)
                    return;
                }
                console.log('Lien Interne')
            }
                return;
            case "INPUT": {
                if (el.getAttribute('type') && el.type === 'submit') {
                    console.log("Là on envoie un form nan ?")
                    console.log(`${tagId} clicked at ${timestamp}`)
                    return;
                } else {
                    console.log('un input ou un button')
                    console.log(`${tagId} clicked at ${timestamp}`)
                }
            }
                return;
            case "BUTTON":
                if (parentTagName === "A") {
                    if (!el.parentElement.href.includes(getDomain())) {
                        console.log('Lien externe');
                        console.log(`${tagId} clicked at ${timestamp}`)
                        return;
                    }
                    console.log('Lien Interne')
                    return;
                }
                console.log('C\'est un bouton')
                if (el.getAttribute('type') && el.type === 'submit') {
                    console.log("On envoie un form ?")
                    console.log(`${tagId} clicked at ${timestamp}`)
                    return;
                }
                return;
            case "FORM":
                console.log("Tu cliques sur un form la nan ?")
                console.log(`${tagId} clicked at ${timestamp}`)
                return;
        }
}

function handleClickExt(el) {
    directive = false
    console.log(`Directive ? ${directive}`)
    timestamp = Date.now()
    tagName = el.tagName;
    parentTagName = el.parentElement.tagName
    tagValue = el.value
    // parentTagId = e.target.parentElement.id
    console.log(`Clicked at ${timestamp}`)
    console.log(`Tag name is ${tagName}`)
    if (el.id) {
        tagId = el.id
        console.log(`Element ID is ${tagId}`)
    }
    if (parentTagName === "A") {
        console.log('Its a link !')
        console.log(`Parent tag name is ${parentTagName}`)
    }
    checkUrls()
    console.log(`${getURL()}`)
    isConnected()
}

window.localStorage.setItem('url', getURL());
window.localStorage.setItem('JWT', getJWT());
// function setupEvent() {
//   console.log('event setup')
//   // CLick event on body
//   let bodyClick =  document.querySelector("body")
//   bodyClick.addEventListener("click", (e) => handleClick(e));
//
//   // Submit event on body
//   let bodySub = document.querySelector("body")
//   bodySub.addEventListener("submit", (e) => handleSubmit(e));
//
//   let allInput = document.querySelectorAll("input")
//   console.log(document)
//   console.log(allInput)
//
//   // Setup event for the input tags
//   if (document.querySelector("input[type='email']")) {
//     let inputArray = document.querySelectorAll("input[type='email']");
//     inputArray.forEach(function(input) {
//       input.addEventListener("change", (e) => {
//         console.log('oueeee')
//         if (e.target.value != null) {
//           console.log('tomato')
//           handleInput(e)
//         }
//       })
//     })
//
//   }
// }
function getURL() {
  return window.location.pathname
}

function getDomain(){
    return window.location.hostname.replace('www.', '');
}
//
function getJWT() {
  return "JWT"
}

function checkUrls() {
  console.log('url')
  if(window.localStorage.getItem('url') === getURL()) {
    return;
  }
  window.localStorage.setItem('url', getURL());
  console.log('url changed')
}

function checkTheme() {
  darkTheme = document.documentElement.classList.contains('dark')
  console.log('theme checked')
}

function isConnected() {
  //Double boolean negation "!!" => if (window.localStorage.getItem("JWT") {connected = true} else {connected = false}
  connected = !!window.localStorage.getItem("JWT");
  console.log('connected checked')
  return connected
}

function handleSubmit(e) {
    tagId = e.id
    tagName = e.tagName
    timestamp = Date.now()
    setTimeout(() => {
    console.log(`${tagName} submitted at ${timestamp}`);
    },500)
}
//
// function handleInput(e) {
//   tagId = e.target.id
//   timestamp = Date.now()
//   setTimeout(() => {
//     console.log(`${tagId} inputed at ${timestamp}`);
//   },500)
// }