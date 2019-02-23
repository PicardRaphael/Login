import GameBase from 'p3demos/games/Base'
import MainScene from './scenes/Main'
import config from './config'
// import description from './README.md'
const description = require('./README.md')

export default class extends GameBase {
  static gameName = 'Les bases'
  static desc = description

  constructor() {
    super(config)
    this.scene.add('Game', MainScene)
    this.scene.start('Game')
  }
}