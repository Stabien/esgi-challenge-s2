<script>

console.log('widget')


// document.querySelector("body").addEventListener("input", (e) => handleInput(e));

window.localStorage.setItem('url', getURL());
window.localStorage.setItem('pastUrl', getPastURL());
window.localStorage.setItem('JWT', getJWT());


// On met l'url et l'url précédent dans le localStorage et on réactualise les valeur toutes les 2 secondes. C'est pour pouvoir gérer les SPA
// A noter, le document.referrer utilisé dans le getPastURL() ne fonctionne pas avec les SPA il sera uniquement utilisé à l'arrivée sur le site
setInterval(() => {
  checkUrls()
  checkTheme()
  // console.log('Current URL is '+window.localStorage.getItem('url'))
  // console.log('Precedent URL is '+window.localStorage.getItem('pastUrl'))
  // console.log('Domain is '+ domain)
  // console.log('Theme is dark ? : '+ darkTheme)
}, 1000)

setInterval(() => {
  isConnected()
}, 5000)

let domain = getDomain();
let tagName
let parentTagName
let tagId
let parentTagId
let darkTheme
let connected
let timestamp



function setupEvent() {
  document.querySelector("body").removeEventListener("click", handleClick)
  document.querySelector("body").removeEventListener("submit", handleSubmit)
  document.querySelector("input").removeEventListener("change", handleInput)

  // CLick event on body
  document.querySelector("body").addEventListener("click", (e) => handleClick(e));

  // Submit event on body
  document.querySelector("body").addEventListener("submit", (e) => handleSubmit(e));

  // Setup event for the input tags
  if (document.querySelector("input[type='email']")) {
    let inputArray = document.querySelectorAll("input");
    inputArray.forEach(function(input) {
      input.addEventListener("change", (e) => {
        if (e.target.value != null) {
          handleInput(e)
        } else {
          return
        }
      })
    })

  }
}

function getURL() {
  return document.URL
}
function getPastURL() {
  return document.referrer;
}

function getDomain(){
  return window.location.hostname.replace('www.', '');
}

function getJWT() {
  return "JWT"
}

function checkUrls() {
  if(window.localStorage.getItem('url') === getURL()) {
    return;
  }
  window.localStorage.setItem('pastUrl', window.localStorage.getItem('url'));
  window.localStorage.setItem('url', getURL());
  setupEvent()
}

function checkTheme() {
  darkTheme = document.documentElement.classList.contains('dark')
}

function isConnected() {
  //Double boolean negation "!!" => if (window.localStorage.getItem("JWT") {connected = true} else {connected = false}
  connected = !!window.localStorage.getItem("JWT");
  return connected
}

let test =0
function handleClick(e) {
  test +=1
  console.log(test)
  timestamp = Date.now()
  tagName = e.target.tagName;
  parentTagName = e.target.parentElement.tagName
  tagId = e.target.id
  parentTagId = e.target.parentElement.id

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
      if (!e.target.href.includes(getDomain())) {
        console.log('Lien externe');
        console.log(`${tagId} clicked at ${timestamp}`)
        e.preventDefault()
        return;
      }
      console.log('Lien Interne')
    }return;
    case "INPUT": {
      if (e.target.getAttribute('type') && e.target.type === 'submit') {
        console.log("Là on envoie un form nan ?")
        console.log(`${tagId} clicked at ${timestamp}`)
        return;
      } else {
        console.log('un input ou un button')
        console.log(e.type)
        console.log(`${tagId} clicked at ${timestamp}`)
      }
    }return;
    case "BUTTON":
      if (parentTagName === "A")
      {
        if (!e.target.parentElement.href.includes(getDomain())) {
          console.log('Lien externe');
          console.log(`${tagId} clicked at ${timestamp}`)
          e.preventDefault()
          return;
        }
        console.log('Lien Interne')
        return;
      }
      console.log('C\'est un bouton')
      if (e.target.getAttribute('type') && e.target.type === 'submit') {
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

function handleSubmit(e) {
  tagId = e.target.id
  timestamp = Date.now()
  setTimeout(() => {
    console.log(`${tagId} inputed at ${timestamp}`);
  },500)
}

function handleInput(e) {
  tagId = e.target.id
  timestamp = Date.now()
  setTimeout(() => {
    console.log(`${tagId} inputed at ${timestamp}`);
  },500)
}
</script>
