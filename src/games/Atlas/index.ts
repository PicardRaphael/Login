import GameBase from 'p3demos/games/Base'
import MainScene from './scenes/Main'
import config from './config'


export default class extends GameBase {
  static gameName = 'Atlas/Multiatlas'

  constructor() {
    super(config)
    this.scene.add('Game', MainScene)
    this.scene.start('Game')
  }
}