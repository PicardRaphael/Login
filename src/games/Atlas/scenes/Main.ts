import config from 'p3demos/games/Atlas/config'
import atlas from 'p3demos/assets/atlas'


export default class Main extends Phaser.Scene {
  cursors: Phaser.Input.Keyboard.CursorKeys
  platforms: Phaser.Physics.Arcade.StaticGroup
  player: Phaser.Physics.Arcade.Sprite
  stars: Phaser.Physics.Arcade.Group
  bombs: Phaser.Physics.Arcade.Group

  score: number
  scoreText: Phaser.GameObjects.Text

  preload() {
    // this.load.multiatlas('assets', assets.atlas, 'src/games/Atlas/assets')
    console.log(atlas)
    this.load.multiatlas('assets', atlas.map, atlas.spritesheet)
  }

  create() {
    console.log('---- yo ----')
    console.log(atlas)
    console.log(this.textures.list)
    console.log('---- yo ----')
    this.add.image(config.width/2, config.height/2, 'assets', 'textures/sky.png')

    this.platforms = this.physics.add.staticGroup()
    this.platforms.create(400, 568, 'assets', 'blocks/platform.png').setScale(2).refreshBody()
    this.platforms.create(550, 400, 'assets', 'blocks/platform.png')
    this.platforms.create(250, 250, 'assets', 'blocks/platform.png').setScale(0.7).refreshBody()
    this.platforms.create(750, 220, 'assets', 'blocks/platform.png').setScale(0.6).refreshBody()
    this.platforms.create(400, 150, 'assets', 'blocks/platform.png').setScale(0.4).refreshBody()
    
    

    this.player = this.physics.add.sprite(100, 45, 'assets', 'player/idle/dude-01.png')
    this.player.setBounce(0.2)
    this.player.setCollideWorldBounds(true)
    this.player.setPosition(30, 480)

    this.anims.create({
      key: 'player-goes-left',
      frames: this.anims.generateFrameNames('assets', {
        start: 1,
        end: 4,
        zeroPad: 2,
        prefix: 'player/left/dude-',
        suffix: '.png'
      }),
      frameRate: 10,
      repeat: -1,
      yoyo: true
    })

    this.anims.create({
      key: 'players-idles',
      frames: [ {
        key: 'assets',
        frame: 'player/idle/dude-01.png'
      }],
      frameRate: 20
    })

    this.anims.create({
      key: 'player-goes-right',
      frames: this.anims.generateFrameNames('assets', {
        start: 1,
        end: 4,
        zeroPad: 2,
        prefix: 'player/right/dude-',
        suffix: '.png'
      }),
      frameRate: 10,
      repeat: -1,
      yoyo: true
    })

    this.stars = this.physics.add.group({
      key: 'assets',
      frame: 'items/star.png',
      repeat: 11,
      setXY: {
        x: 12,
        y: 0,
        stepX: 70
      }
    })

    this.stars.children.iterate(function(child) {
      // @ts-ignore
      child.body.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4))
    })

    this.physics.add.overlap(
      this.player,
      this.stars,
      this.collectStar,
      null
    );

    this.cursors = this.input.keyboard.createCursorKeys();

    this.score = 0
    this.scoreText = this.add.text(16, 16, 'score: 0', {
      fontSize: '24px',
      fill: '#000'
    })

    this.bombs = this.physics.add.group()

    this.physics.add.collider(this.player, this.platforms)
    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.collider(this.bombs, this.platforms);
    this.physics.add.collider(this.player, this.bombs, this.hitBomb)
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-260);
      this.player.anims.play('player-goes-left', true);
    }
    else if (this.cursors.right.isDown) {
      this.player.setVelocityX(260);
      this.player.anims.play('player-goes-right', true);
    }
    else {
      this.player.setVelocityX(0);
      // this.player.anims.play('player-idles');
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-500)
    }
  }

  collectStar: ArcadePhysicsCallback = (
    player: Phaser.Physics.Arcade.Sprite,
    star: Phaser.Physics.Arcade.Sprite
  ) => {
    star.disableBody(true, true)
    this.score += 10
    this.scoreText.setText('Score: ' + this.score)

    if (this.stars.countActive() === 0) {
      this.stars.children.iterate(function(child: Phaser.Physics.Arcade.Sprite) {
        child.enableBody(true, child.x, 0, true, true)
      })
      const x = (player.x < 400)
            ? Phaser.Math.Between(400, 800)
            : Phaser.Math.Between(0, 400)
      const bomb = this.bombs.create(x, 16, 'assets', 'bombs/spine.png')
      bomb.setBounce(1)
      bomb.setScale(0.15)
      bomb.setCollideWorldBounds(true)
      bomb.setVelocityX(Phaser.Math.Between(-200, 200), 20)
    }
  }

  hitBomb: ArcadePhysicsCallback = (
    player: Phaser.Physics.Arcade.Sprite,
    bomb: Phaser.Physics.Arcade.Sprite
  ) => {
    this.physics.pause()
    player.setTint(0xff00000)
    // player.anims.play('player-idles')
    this.cameras.main.fadeOut(1500, 255)
    this.cameras.main.on('camerafadeoutcomplete', () => {
      this.scene.restart()
    })
  }
}