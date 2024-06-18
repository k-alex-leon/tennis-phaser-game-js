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

let ball = null;
// takes care of preload the assets
function preload() {
  this.load.image("ball", "/ball.png");
}
// is executed once when everithing is loaded and ready
function create() {
   ball = this.physics.add.image(100, 100, 'ball')
   ball.setCircle(10)

   ball.setCollideWorldBounds(true)
   ball.setBounce(1)

   ball.setVelocity(150)

   this.physics.add.collider(ball)
  console.log("I'm ready!");
}
// is executed on everty frame
function update() {
}
