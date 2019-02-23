# Notes

## Canvas qui se resize

``` css
canvas {
  width: 100%;
}
```

## Cycle de vie d'une Scene

init() -> preload() -> create() -> update()

- init : configuration de base, création dans le moteur de jeu
- preload : pré-chargement d'assets pour éviter délai d'affichage
- create : création de la scène en tant que telle
- update : game-loop

## Coordonnées

- x horizontal, y vertical (2D)
- origin (0,0)
- assets placées aux coordonnées de leur centre
- modifiable avec asset.setOrigin(0,0)
- `this.sys.game.config[.height|.width]` pour accéder à la config

## Profondeur (plans)

- `asset.depth` — valeurs relatives
