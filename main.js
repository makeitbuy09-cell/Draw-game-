let level = 0, drawing = false, win = false, lost = false;
let player, ground, graphics, text;

const levels = [
  { y: 80 },
  { y: 40 },
  { y: 120 },
  { y: 60 }
];

const config = {
  type: Phaser.AUTO,
  width: 360,
  height: 640,
  backgroundColor: "#eeeeee",
  physics: {
    default: "arcade",
    arcade: { gravity: { y: 600 } }
  },
  scene: { create }
};

new Phaser.Game(config);

function create() {
  PokiSDK.init();
  PokiSDK.gameplayStart();

  graphics = this.add.graphics();
  win = lost = false;

  player = this.physics.add.circle(
    180,
    levels[level].y,
    14,
    0x00aa00
  );

  ground = this.physics.add.staticRect(180, 620, 360, 40);

  this.physics.add.collider(player, ground, () => winLevel(this));

  player.body.onWorldBounds = true;
  this.physics.world.on("worldbounds", () => lose(this));

  text = this.add.text(10, 10, `Level ${level+1}`, {
    font: "18px Arial",
    color: "#000"
  });

  this.input.on("pointerdown", () => {
    if (win || lost) return;
    graphics.clear();
    drawing = true;
  });

  this.input.on("pointermove", p => {
    if (!drawing) return;
    graphics.lineStyle(6, 0x000000);
    graphics.lineBetween(
      p.prevPosition.x,
      p.prevPosition.y,
      p.x,
      p.y
    );
  });

  this.input.on("pointerup", () => drawing = false);
}

function winLevel(scene) {
  if (win) return;
  win = true;
  level = (level + 1) % levels.length;
  PokiSDK.gameplayStop();
  PokiSDK.commercialBreak(() => scene.scene.restart());
}

function lose(scene) {
  if (lost) return;
  lost = true;
  PokiSDK.gameplayStop();
  scene.add.text(100, 300, "FAILED\nTap to retry", {
    font: "22px Arial",
    color: "#ff0000",
    align: "center"
  });
  scene.input.once("pointerdown", () => scene.scene.restart());
}