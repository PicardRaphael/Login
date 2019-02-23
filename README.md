# Projet : création d'un jeu

Atelier de conception-développement.

**Deux équipes de 5 personnes**, conçoivent chacune un **jeu** sous la forme d'une **application multicouche répartie**.

- 3 semaines au total, mi-cours, mi-dev
- objectif application déployée en production
- objectif base de code saine POO intégrant les notions & technos fortes vues jusqu'ici

**Contraintes tech & diverses** :

- client TypeScript utilisant Phaser
- back libre utilisant MongoDB
- archi multicouche & répartie (à des degrés divers selon l'applicatif)
- compte utilisateur (authentification)
- application déployée en production

**Résumé Phaser** :

- site officiel : https://phaser.io
- code source : https://github.com/photonstorm/phaser
- doc v3 : https://photonstorm.github.io/phaser3-docs/index.html
- exemples v3 : http://labs.phaser.io
- exemples de jeu réels : https://itch.io/games/made-with-phaser
- suivi des projets Meteor : [O-clock-Meteor/CDA-P06-Support--Phaser-demo](https://github.com/O-clock-Meteor/CDA-P06-Support--Phaser-demo)
- [démos Phaser 3 de jd](https://demos-phaser3.nico.oclock.io/)

## Groupes

### Bomboys

- Membres : Jinane, Dylan, Guillaume, Christelle, Séverine
- [Document de cadrage](https://docs.google.com/document/d/118EYi3dW_TBQkLNGMpwZ-I7xACdJr5e6gE0aiFg1GFE/edit?usp=sharing)
- [Use-cases](https://airtable.com/tbljRAGTA7NiOfCXn/viwFNx4xRaySic9dn?blocks=hide)
- [Board](https://trello.com/b/GdtD3G9W/jeu-m%C3%A9t%C3%A9or)
- [Repo de code](https://github.com/O-clock-Meteor/CDA-P06-Bomboys)

### Ninjagone

- Membres : Paul, Sébastien, Mathieu, Nicolas, Raphaël
- [Document de cadrage](#)
- [Board](https://github.com/O-clock-Meteor/Ninjagone/projects/1)
- [Repo de code](https://github.com/O-clock-Meteor/Ninjagone)

## Build de dev & prod

### Tester

Installer globalement [`http-server`](https://www.npmjs.com/package/http-server).

``` sh
yarn build:dev
# ou
yarn build:prod

http-server dist
```

### Déploiement

- `docker build -t oclock/demos-phaser3 .`
- `docker run -it -p 5000:80 oclock/demos-phaser3` pour tester en local
- `docker push oclock/demos-phaser3:vX` où `X` est la prochaine release (penser à `git tag` etc.)
- sur la prod, `docker pull` puis [redeploy](https://github.com/dokku/dokku/blob/master/docs/deployment/methods/images.md#deploying-from-a-docker-registry)
