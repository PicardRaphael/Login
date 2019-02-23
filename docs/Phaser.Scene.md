# Scènes

## Pré-requis : créer un jeu

Un jeu Phaser est un objet auquel est rattaché *au moins* une scène. L'objet-jeu intègre également une configuration globale, et met à disposition des scènes des systèmes globaux (par exemple, moteur de rendu WebGL/Canvas, gestion des _inputs_ utilisateur, etc.)

``` js
import MyFirstScene from 'scenes/MyFirstScene'

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: MyFirstScene
}

const game = new Phaser.Game(config)
```

Un jeu peut avoir plusieurs scènes actives en même temps :

``` js
{
  scene: [SceneA, SceneB]
}
```

## Créer une scène

Une scène (instance de type `Phaser.Scene`) représente une vue concrète du jeu. Dans une scène, on affiche des éléments de jeu (instance de type `GameObject`), qui pourront être dotés d'une physique (collision, déplacement, etc.)

``` js
export default class extends Phaser.Scene {
  constructor() {
    super('MyFirstScene')
  }

  preload() {
    this.load.image('logo', 'assets/sprites/logo.png')
  }

  // Obligatoire :
  create() {
    this.add.image(400, 300, 'logo')
  }

  update() {
    // ...
  }
}
```

### Configuration d'une scène

Au-delà du simple nom de la scène, on peut passer un objet de configuration complet.

``` js
export default class extends Phaser.Scene {
  constructor() {
    super({
      key: 'SceneName',

      // Moteur physique spécifique de cette scène.
      physics: {
        arcade: {
          debug: true,
          gravity: {y: 200}
        }
      },

      // Pré-chargement d'images (avant même preload()).
      files: [
        { type: 'image1', key: 'thisImage', url: 'image1.png' },
        { type: 'image2', key: 'thatImage', url: 'image2.png' },
      ]
    })
  }
}
```

### Systèmes (plugins) liés à une scène

Quand une scène est ajoutée à l'objet-jeu, plusieurs systèmes lui sont greffés dans sa propriété `sys`. Chaque système est géré par un plugin Phaser.

> Certains systèmes sont spécifiquement crées pour la scène (système locaux), tandis que d'autres sont réutilisés & partagés entre chaque scène (systèmes globaux, rattachés à l'objet-jeu voire au contexte d'exécution du programme — ex. `window` dans le navigateur).

Une scène possède ainsi plusieurs systèmes de base, inter-dépendants et non-débranchables :

- un système pub/sub pour la communication interne
- un système de caméra 2D
- un système pour créer des `GameObject` de divers types
- un système pour gérer la liste des objets de la scène
- un système pour gérer les mises à jour (_update_)

> Par exemple, en écrivant `this.add.image` (où `this` est une `Phaser.Scene`), on mobilise le système de création de `GameObject`, qui vient placer des objets dans la liste gérée par le système de gestion de liste d'objets de la scène.

Une scène possède également des systèmes par défaut, modifiables voire débranchables :

- un système de caméra 3D
- un système d'horloge
- un système de gestion de données (registre)
- un système de gestion des _inputs_ utilisateur
- un système de chargement d'assets
- un système de gestion des transitions (_tweens_)
- un système d'éclairage

On contrôle quels systèmes sont disponibles dans une scène _via_ son objet de configuration :

``` js
{
  key: 'SceneName',

  // Aucun système par défaut ! (les systèmes de base restent présents)
  plugins: []
}
```

``` js
{
  key: 'SceneName',

  // Autorise l'utilisation de this.load
  plugins: ['Loader']
}
```

### Injection de systèmes

#### Ajout dynamique de systèmes

Il est possible de décider _a posteriori_ de rajouter des systèmes :

``` js
export default class extends Phaser.Scene {
  constructor() {
    super({
      key: 'SceneName',
      plugins: []
    })
  }

  // Hook appelé après la création d'une instance.
  init() {
    this.sys.install('Loader')
  }
}
```

#### Mapping de systèmes

Plus pratique encore, il est possible de modifier le _mapping_ entre un plugin/système, et une propriété de la scène.

> **Mapping par défaut**
>
> Système fondamentaux :
>
> - `this.anims` => Animation Manager (Global)
> - `this.cache` => Cache (Global)
> - `this.game` => Phase.Game instance (Global)
> - `this.registry` => Game Data Manager (Global)
> - `this.sound` => Sound Manager (Global)
> - `this.textures` => Texture Manager (Global)
> - `this.add` => Game Object Factory (Local, Core)
> - `this.cameras` => 2D Camera Manager (Local, Core)
> - `this.children` => Display List (Local, Core)
> - `this.events` => Event Emitter (Local, Core)
> - `this.make` => Game Object Creator (Local, Core)
> - `this.scene` => Scene Manager Plugin (Local, Core)
>
> Systèmes de base :
>
> - `this.cameras3d` => 3D Camera Manager (Local, Optional)
> - `this.data` => Scene Data Manager (Local, Optional)
> - `this.impact` => Impact Physics (Local, Optional)
> - `this.input` => Input Plugin (Local, Optional)
> - `this.lights` => Lights Manager Plugin (Local, Optional)
> - `this.load` => Loader Plugin (Local, Optional)
> - `this.matter` => Matter JS Physics (Local, Optional)
> - `this.physics` => Arcade Physics (Local, Optional)
> - `this.time` => Time / Clock Plugin (Local, Optional)
> - `this.tweens` => Tween Manager (Local, Optional)

Pour supprimer tous les mappings, dans la configuration d'une scène :

``` js
{
  map: {}
}
```

Pour modifier le nom de certaines propriétés :

``` js
{
  cameras: 'cams', // this.cams.main …
  add: 'append' // this.append.image …
}
```

## Échange de données entre scènes

Trois possibilités :

- appel de fonction
- pub/sub
- base de données Phaser (_registry_)

### Appel de fonction

> [Exemple sur labs.phaser.io](http://labs.phaser.io/edit.html?src=src\scenes\call%20function%20in%20another%20scene%20es6.js)

``` js
// Quelque part dans le code de SceneA :
const sceneB = this.scene.get('SceneB')
const position = sceneB.someMethod()
```

### Pub/sub

``` js
// Quelque part dans SceneA
this.events.emit('someEvent', data)

// Quelque part dans SceneB
const sceneA = this.scene.get('SceneA')
sceneA.events.on('someEvent', (data) => {
  // ...
})
```

Le couplage entre les deux scènes est inversé par rapport à l'exemple d'appel de fonction, mais il existe toujours.

### Registre

> [Exemple labs.phaser.io](http://labs.phaser.io/view.html?src=src\scenes\ui%20scene%20es6.js)

Un registre Phaser est une instance de `Phaser.Data.DataManager`. Il s'agit d'une base de données clé-valeur interne au jeu. Chaque scène d'un jeu Phaser partage un même registre, ce qui permet la communication inter-scènes.

``` js
// Quelque part dans le code de SceneA :
this.registry.set('score', this.score)

// Quelque part dans le code de SceneB :
this.registry.get('score')
```

`SceneB` peut également être réactif :

``` js
this.registry.events.on('changedata', this.updateData)
```

auquel cas le callback `updateData` reçoit :

- le propriétaire du registre => l'objet-jeu
- le nom de la clé qui a été modifiée dans le registre (ex. `'score'`)
- la dernière valeur en date de la clé modifiée