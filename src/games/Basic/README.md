# Les bases

Cet exemple correspond au [tutoriel de base](https://phaser.io/tutorials/making-your-first-phaser-3-game) de Phaser 3.

L'organisation du code source laisse à désirer, tout est dans le même fichier scenes/Main.ts !

## Concepts importants

### Plugins (=== systèmes) d'une scène

Quand on écrit `this.load` par exemple, `this` représente la scène (une instance de `Phaser.Scene`) et `.load` donne accès à une instance de [`Phaser.LoaderPlugin`](https://photonstorm.github.io/phaser3-docs/Phaser.Loader.LoaderPlugin.html) pré-instanciée par le jeu *pour cette scène spécifiquement*. Le _Loader_ de la scène permet de pré-charger toutes sortes de ressources, telles que des images, des sons, des textures, etc. Une scène comporte plusieurs autres systèmes en plus d'un _Loader_ ; certains sont utilisés dans cet exemple et décrits ci-après.

### Pré-chargement d'objets graphiques

``` ts
preload() {
  this.load.image('bomb', basics.bomb)
}
```

où `basics` est un objet listant certains des assets (images, spriteshets…) requises par la scène. Il faut les `require` pour que Webpack les intègre dans le bundle de sortie. Pour chaque paire clé/valeur de `basics`, la clé correspond au chemin complet de l'image (type `string`), tel que connu par Webpack, ce qui permet de s'affranchir du nom initial de l'asset et ainsi gérer le cache pour le bundle de production.

### Ajout d'objets graphiques dans la scène

``` ts
create() {
  this.add.image(0, 0, 'bomb')
}
```

où `.add` donne accès à la [`GameObjectFactory`](https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.GameObjectFactory.html) de la scène. Cette _Factory_ permet de facilement créer des objets (instances de `GameObject`) de tous types, éventuellement en utilisant des assets pré-chargés.

### Groupe d'objets graphiques

``` ts
this.platforms = this.physics.add.staticGroup()
this.platforms.create(550, 400, 'ground')
this.platforms.create(400, 568, 'ground').setScale(2).refreshBody()
```

Un [`Phaser.Physics.Arcade.StaticGroup`](https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Arcade.StaticGroup.html) permet de gérer plusieurs objets (ici statiques *ie.* immobiles) de manière unifiée : déplacement de tous les objets, par exemple. Un groupe peut contenir un nombre limité ou illimité (par défaut) d'objets. Tous les objets sont du type [`GameObject`](https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.GameObject.html), mais il s'agit d'une classe généraliste (de base) et les objets concrets sont en fait des images, des sprites, etc.

Noter l'utilisation de la fonction [`refreshBody()`](https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Arcade.Image.html#refreshBody__anchor), spécifique des objets statiques : elle permet de synchroniser la position du _body_ (empreinte physique de l'objet dans la scène, donc ce qu'on voit à l'écran) avec le `GameObject` sous-jacent (l'objet appartenant au groupe).

Les objets dynamiques, qui sont éventuellement regroupables dans un groupe de type `Group` (créé avec `group()`), ont leurs _body_ automatiquement synchronisés. Par exemple, les étoiles forment un [groupe dynamique](https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Arcade.Group.html), crée déclarativement au travers d'un objet de configuration de type [`GroupeCreateConfig`](https://photonstorm.github.io/phaser3-docs/global.html#GroupCreateConfig). Toutes les étoiles sont animées, avec un peu de [RNG](https://fr.wikipedia.org/wiki/G%C3%A9n%C3%A9rateur_de_nombres_al%C3%A9atoires) pour les dynamiser visuellement.

### Sprite vs Image

Un `GameObject` de type `Image` est statique (immobile). Un `Sprite` est similaire à une image, mais peut être déplacé & animé avec des transitions (_tweens_).

### Moteur physique

Les objets ont tous un _body_, qui correspond à leur empreinte physique concrète dans la scène (et détermine pour partie leur rendu visuel, les interactions avec les autres objets, etc.) Le comportement du _body_ dépend du moteur physique activé dans la scène ; et selon le moteur physique activé, les objets seront des instances de classes différentes.

Phaser fournit deux moteurs physiques, il est possible d'en installer d'autres :

| Classe de base d'objet | Moteur `Arcade` | Moteur `MatterJS` |
|:-----------------------|:---------------:|------------------:|
| [`Phaser.GameObjects.Image`](https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Image.html) | [`Phaser.Physics.Arcade.Image`](https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Arcade.Image.html) | [`Phaser.Physics.Matter.Image`](https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Matter.Image.html) |
| [`Phaser.GameObjects.Sprite`](https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Sprite.html) | [`Phaser.Physics.Arcade.Sprite`](https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Arcade.Sprite.html) | [`Phaser.Physics.Matter.Sprite`](https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Matter.Sprite.html) |

### Animations

Les objets de type sprite peuvent être animés, grâce au [gestionnaire `Animation`](https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Components.Animation.html) (système) de la scène, accessible via `this.anims`. Pour enregistrer des animations auprès du gestionnaire, il faut les décrire sous la forme d'objets de type [`Phaser.Animations.Animation`](https://photonstorm.github.io/phaser3-docs/Phaser.Animations.Animation.html). On peut le faire facilement en utilisant la factory du gestionnaire :

``` ts
this.anims.create({
  key: 'left',
  frames: this.anims.generateFrameNumbers('dude', {
    start: 0,
    end: 3
  }),
  frameRate: 10,
  repeat: -1
})
```

où l'argument est du type [`Phaser.Animations.Types.Animation`](https://photonstorm.github.io/phaser3-docs/Phaser.Animations.Types.html#.Animation).

* La clé `key` est un nom arbitraire qui permettra de référencer l'animation ainsi crée, pour la jouer, l'arrêter, etc.
* La clé `frames` permet de décrire les différentes _frames_ (étapes) de l'animation. Une _frame_ === une image. Les images peuvent provenir de différentes sources. Dans l'exemple ci-dessus, elles sont extraites d'une _spritesheet_ (une image comportant en fait plusieurs sous-images (côte à côte) grâce à l'utilitaire `generateFrameNumbers`. Le premier argument passé à cet utilitaire est le nom d'une _spritesheet_ pré-chargée dans la scène.
* Les autres clés sont décrites dans la documentation et permettent de contrôller le déroulement de l'animation.

### Collision d'objets

Les objets, ou groupes d'objets, n'ont pas de « présence matérielle » par défaut : ils peuvent se superposer sans intéragir. On peut activer les collisions au moyen d'un collisionneur ([`Phaser.Physics.Arcade.Collider`](https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Arcade.Collider.html)).

``` ts
this.physics.add.collider(this.player, this.platforms)
```

### Contrôles clavier

Par défaut, la scène ne reconnaît aucun _input_ clavier. Dans l'exemple, les flèches directionnelles sont activées avec `createCursorKeys()`. Une fois activées, il est possible de brancher des écouteurs d'évènements sur les touches, ou plus simplement comme dans cet exemple, de vérifier périodiquement dans `update()` quelle(s) touche(s) est(sont) active(s) pour impacter le rendu des objets de la scène (changement de vélocité qui modifiera la position au cours du temps, démarrage/arrêt d'animations, etc.)

``` ts
update() {
  if (this.cursors.left.isDown) {
    this.player.setVelocityX(-260);
    this.player.anims.play('left', true);
  }
  // ...
}
```

### Viewport, caméra

La géométrie du jeu est définie dans une configuration globale, qui détermine la taille du `<canvas>`. Par ailleurs, chaque scène peut définir une taille du « monde » dans lequel placer des objets (par défaut d'extension infinie), ainsi qu'une (voire plusieurs) caméra(s) pour générer, à l'intérieur des limites du canvas, une représentation graphique totale ou partielle du monde.

Le cas simple est celui où canvas, monde et champ de la caméra (_viewport_) coïncident, comme dans cet exemple. Dans de nombreux jeux, ce n'est pas le cas, et il faut indiquer à Phaser comment gérer la caméra, définir éventuellement les limites du monde de la scène courante, etc.