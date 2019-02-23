abstract class Base extends Phaser.Game {
  static gameName: string
  static desc = ''

  get description() {
    return (this as any).constructor.desc
  }
}

export default Base