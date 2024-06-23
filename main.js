import "./style.css";
import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: 0xb9b9b9,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      // debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: {
    preload,
    create,
    update,
  },
};
const game = new Phaser.Game(config);

let ball;
let paddle;
let bricks;
let newBrick;
let brickInfo = {
  width: 50,
  height: 50,
  count: {
    row: 3,
    col: 7,
  },
  offset: {
    top: 50,
    left: 60,
  },
  padding: 10,
};

// text style
let textStyle = {
  font: "18px Arial",
  fill: "#0095DD",
};
// score
let scoreTxt;
let score = 0;

// user lives
let lives = 3;
let livesTxt;
let lifeLostText;

function initBricks(ctx) {
  bricks = ctx.add.group();

  for (let c = 0; c < brickInfo.count.col; c++) {
    for (let r = 0; r < brickInfo.count.row; r++) {
      // create new brick and adding to the group (bricks)
      let brickX =
        c * (brickInfo.width + brickInfo.padding) + brickInfo.offset.left;
      let brickY =
        r * (brickInfo.height + brickInfo.padding) + brickInfo.offset.top;

      newBrick = ctx.physics.add.image(brickX, brickY, "brick");

      // ctx.physics.add.collider(newBrick, ball)
      newBrick.setImmovable(true);

      bricks.add(newBrick);
    }
  }
}

function ballHitBrick(ball, brick) {
  // brick.kill() // -> is not working for this version
  brick.destroy();
  score++;
  scoreTxt.setText(`Score: ${score}`);

  if (score >= brickInfo.count.col * brickInfo.count.row) {
    stopGame("YOU WIN");
  }
}

function ballHitPaddle(ball, paddle) {
  ball.play("wobble");
}

function stopGame(message) {
  console.log(message);
  game.destroy(true, false);
}

// takes care of preload the assets
function preload() {
  // this.load.image("ball", "/ball.png");
  this.load.image("paddle", "/paddle.png");
  this.load.image("brick", "/brick.png");
  this.load.spritesheet("ball", "/wobble.png", {
    frameWidth: 20,
    frameHeight: 20,
  });
}
// is executed once when everithing is loaded and ready
function create() {
  // ball config

  this.anims.create({
    key: "wobble",
    frames: this.anims.generateFrameNumbers("ball", { start: 1, end: 2 }),
    frameRate: 10,
    repeat: 1,
  });

  ball = this.physics.add.sprite(
    game.canvas.width * 0.5,
    game.canvas.height - 20,
    "ball"
  );

  // ball = this.add.sprite(
  //   game.canvas.width * 0.5,
  //   game.canvas.height - 25,
  //   "ball"
  // );

  // ball.animations.add("wooble", [0, 1, 0, 2, 0, 1, 0, 2, 0], 24);
  // set a radius
  ball.setCircle(10);

  ball.setCollideWorldBounds(true);
  ball.setBounce(1);

  ball.setVelocity(150, -150);

  this.physics.add.collider(ball);

  // paddle config
  paddle = this.physics.add.image(
    game.canvas.width * 0.5,
    game.canvas.height - 10,
    "paddle"
  );
  // define position
  paddle.x = game.input.x || game.canvas.width * 0.5;
  // bouns with borders
  // paddle.setCollideWorldBounds(true)
  // doesnt move if it got hit
  paddle.setImmovable(true);
  // add a collide body to the image
  this.physics.add.collider(paddle);

  // no bottom collision
  this.physics.world.checkCollision.down = false;
  // this.physics.world.setBoundsCollision(true, true, true, false)

  // INIT BLOCKS
  // bricks = this.add.group() // -> check later! 😅
  initBricks(this);

  // SCORE
  scoreTxt = this.add.text(10, 10, "Score: 0", textStyle);

  // USER LIVES TEXT
  livesTxt = this.add.text(
    game.canvas.width - 100,
    10,
    `Lives: ${lives}`,
    textStyle
  );

  // lifeLostText = this.add.text(
  //   game.canvas.width * 0.5,
  //   game.canvas.height * 0.5,
  //   "Life lost, click to continue",
  //   textStyle
  // );

  // lifeLostText.setOrigin(0.5);
  // lifeLostText.setVisible(false);

  console.log("I'm ready!");
}

// is executed on everty frame
function update() {
  this.physics.world.collide(ball, paddle, ballHitPaddle);
  this.physics.world.collide(ball, bricks, ballHitBrick);
  paddle.x = this.input.x;

  if (ball.y > game.canvas.height) {
    lives--;
    if (!lives) stopGame("GAME OVER!");

    livesTxt.setText(`Lives: ${lives}`);
    // shake camera
    this.cameras.main.shake(500);

    // this.cameras.main.on('camerashakestart', function (){
    //   lifeLostText.setVisible(true)
    // })

    // this.cameras.main.on('camerashakecomplete', function (){
    //   lifeLostText.setVisible(false)
    // })
    // game.camera.main.shake(500)

    // reset ball position
    ball.x = game.canvas.width * 0.5;
    ball.y = game.canvas.height - 20;
    ball.setVelocity(150, -150);

    // reset paddle position
    paddle.x = game.canvas.width * 0.5;
    paddle.y = game.canvas.height - 10;
  }
}
