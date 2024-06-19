import "./style.css";
import Phaser, { Physics } from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: 0xb9b9b9,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
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
// takes care of preload the assets
function preload() {
  this.load.image("ball", "/ball.png");
  this.load.image("paddle", "/paddle.png");
}
// is executed once when everithing is loaded and ready
function create() {
  // ball config
  ball = this.physics.add.image(
    game.canvas.width * 0.5,
    game.canvas.height - 20,
    "ball"
  );
  // set a radius
  ball.setCircle(10);

  ball.setCollideWorldBounds(true);
  ball.setBounce(1);

  ball.setVelocity(150, -150);

  this.physics.add.collider(ball);

  //  this.physics.arcade.checkCollision.down = false;

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

  console.log("I'm ready!");
}
// is executed on everty frame
function update() {
  this.physics.world.collide(ball, paddle);
  paddle.x = this.input.x;

  if (ball.y > game.canvas.height) {
    console.log("GAME OVER!");
    game.destroy(true, false)
    // game.scene.pause();
    // this.physics.pause();
    // game.destroy(true)
    // location.reload()
  }
}
