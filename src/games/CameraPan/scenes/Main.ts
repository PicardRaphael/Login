import config from 'p3demos/games/Basic/config'
import basics from 'p3demos/games/Basic/assets'


export default class Main extends Phaser.Scene {
  background: Phaser.GameObjects.Image
  cursors: Phaser.Input.Keyboard.CursorKeys
  platforms: Phaser.Physics.Arcade.StaticGroup
  player: Phaser.Physics.Arcade.Sprite
  stars: Phaser.Physics.Arcade.Group
  bombs: Phaser.Physics.Arcade.Group

  score: number
  scoreText: Phaser.GameObjects.Text

  preload() {
    this.load.image('bomb', basics.bomb)
    this.load.image('sky', basics.sky)
    this.load.image('star', basics.star)
    this.load.image('ground', basics.platform)
    this.load.spritesheet('dude', basics.dude, {
      frameWidth: 32,
      frameHeight: 48
    })
  }

  create() {
    this.cameras.main.setBounds(0, 0, 1000, 1000)
    this.physics.world.setBounds(0, 0, 1000, 1000)
    const limits = this.physics.world.bounds


    this.background = this.add.image(0, 0, 'sky')
    this.background.setOrigin(0, 0)
    this.background.setDisplaySize(
      this.physics.world.bounds.width,
      this.physics.world.bounds.height
    )

    // Sol.
    const ground = this.add.tileSprite(0, limits.height - 32, limits.width, 32, 'ground')
    ground.setOrigin(0, 0)
    this.physics.world.enable(ground, Phaser.Physics.Arcade.STATIC_BODY)


    // Plateformes
    this.platforms = this.physics.add.staticGroup()
    this.platforms.create(0, limits.height - 250, 'ground')
    this.platforms.create(550, limits.height - 125, 'ground')
    this.platforms.create(550, limits.height - 325, 'ground').setScale(0.7).refreshBody()
    this.platforms.create(750, limits.height - 450, 'ground').setScale(0.6).refreshBody()
    this.platforms.create(450, limits.height - 550, 'ground')
    this.platforms.create(350, limits.height - 650, 'ground')
    this.platforms.create(750, 220, 'ground').setScale(0.6).refreshBody()
    

    // Personnage jouable.
    this.player = this.physics.add.sprite(100, 45, 'dude')
    this.player.setBounce(0.2)
    this.player.setCollideWorldBounds(true)
    this.player.setPosition(30, limits.height - 150)

    // La caméra suit le personnage jouable.
    this.cameras.main.startFollow(this.player, true, 0.05, 0.05)

    // Animations et contrôles directionnels.
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', {
        start: 0,
        end: 3
      }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'turn',
      frames: [ {
        key: 'dude',
        frame: 4
      }],
      frameRate: 20
    })

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', {
        start: 5,
        end: 8
      }),
      frameRate: 10,
      repeat: -1
    })

    // Activation des flèches directionnelles référencées par les animations.
    this.cursors = this.input.keyboard.createCursorKeys();

    // Collisions entre objets.
    this.physics.add.collider(this.player, ground)
    this.physics.add.collider(this.player, this.platforms)
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-260);
      this.player.anims.play('left', true);
    }
    else if (this.cursors.right.isDown) {
      this.player.setVelocityX(260);
      this.player.anims.play('right', true);
    }
    else {
      this.player.setVelocityX(0);
      this.player.anims.play('turn');
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-500)
    }
  }
}