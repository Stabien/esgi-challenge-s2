

<script>
    // Ceci est le fichier pour le widget.
    console.log('widget')

    document.querySelector("body").addEventListener("click", (e) => handleClick(e));
    window.localStorage.setItem('url', getURL());
    window.localStorage.setItem('pastUrl', getPastURL());


    // On met l'url et l'url précédent dans le localStorage et on réactualise les valeur toutes les 2 secondes. C'est pour pouvoir gérer les SPA
    // A noter, le document.referrer utilisé dans le getPastURL() ne fonctionne pas avec les SPA il sera uniquement utilisé à l'arrivée sur le site
    setInterval(() => {
    checkUrls()
    // console.log('Current URL is '+window.localStorage.getItem('url'))
    // console.log('Precedent URL is '+window.localStorage.getItem('pastUrl'))
    // console.log('Domain is '+ domain)
}, 1000)

    let domain = getDomain();
    let tagName
    let parentTagName

    function getURL() {
    return document.URL
}
    function getPastURL() {
    return document.referrer;
}

    function getDomain(){
    return window.location.hostname.replace('www.', '');
}

    function checkUrls() {
    if(window.localStorage.getItem('url') === getURL()) {
    return;
}
    window.localStorage.setItem('pastUrl', window.localStorage.getItem('url'));
    window.localStorage.setItem('url', getURL());
}
    function handleClick(e) {
    tagName = e.target.tagName;
    parentTagName = e.target.parentElement.tagName

    switch (tagName) {
    // Fall through
    case "H1":
    case "H2":
    case "H3":
    case "HEADER":
    console.log("Titre ou header")
    return;
    case "A": {
    if (!e.target.href.includes(getDomain())) {
    console.log('Lien externe');
    e.preventDefault()
    return;
}
    console.log('Lien Interne')
}return;
    case "INPUT": {
    if (e.target.getAttribute('type') && e.target.type === 'submit') {
    console.log("Là on envoie un form nan ?")
    return;
} else {
    console.log('un input ou un button')
}
}return;
    case "BUTTON":
    if (parentTagName === "A")
{
    if (!e.target.parentElement.href.includes(getDomain())) {
    console.log('Lien externe');
    e.preventDefault()
    return;
}
    console.log('Lien Interne')
    return;
}
    console.log('C\'est un bouton')
    if (e.target.getAttribute('type') && e.target.type === 'submit') {
    console.log("On envoie un form ?")
    return;
}
    return;
    case "FORM":
    console.log("Tu cliques sur un form la nan ?")
    return;
}
}
</script>
