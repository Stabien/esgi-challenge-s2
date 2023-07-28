[center] # Tracker-vite mode d'emploi # [/center] 

## Installation ##

### Avant-propos ###
Tout d'abord vous pouvez retrouver sur le site esgi-tracking un petit tutoriel
indiquant comme télécharger et ajouter le plugin à votre projet. Mais nous
allons aussi décrire comment faire de ce README.

### Téléchargement ###
Afin de télécharger le plugin vue tracker-vite depuis le site de npm vous
pouvez utiliser les package manager npm ou yarn et réaliser à la racine de
votre projet vue les commandes suivantes:

#### Avec Yarn
```yarn add tracker-vite```  


Puis  
```yarn```


#### Avec npm
```npm install tracker-vite```



### Utilisation dans le projet ###
#### Le main.js ####
Le plugin tracker doit tout d'abord être importé dans le main.js à la racine
de votre projet (là ou votre app est mount):

```import { Tracker } from 'tracker-vite';```


Il faut ensuite l'utiliser dans le projet. Attention il faut s'assurer 
de bien demander l'utilisation du tracker avant celle du router et avant 
de mount l'app:

```app.use(Tracker);```

Attention car le plugin Tracker attend en option l'app-id qui vous est fournis
lorsque vous êtes connecté à esgi-tracker sur un compte validé. Le nom de la 
clée est App_id:

```app.use(Tracker, { App_id: <votre app-id> });```

#### Dans votre projet ####
Vous êtes presque prêt à utiliser le tracker il ne vous reste plus qu'à
placer aux endroit que vous souhaiter tracker la directive ``v-track`` du tracker
auquel vous pouvez ajouter: 
- Un argument: faisant office de tag personnalisé qui
sera automatiquement trié dans les données trackée
- Un ou plusieurs modifiers faisant échos aux évènements javascripts qui seront
aussi tracké et trié selon les évènements.

Au final vos directives peuvent ressembler à ceci:

```<div v-track:MON-TAG.click.change.input>```

La configuration du tracker est terminée vous pouvez maintenant l'utiliser.
