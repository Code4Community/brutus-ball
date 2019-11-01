// Initialize Phaser Game Object
var config =
{
    type: Phaser.AUTO,
    parent: "thecanvas",
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
          // gravity: {y: 500}
        }
    },
    scene: {
        preload: preload,
        create: create,
    }
};
var game = new Phaser.Game(config);

// Used to load required images
function preload()
{
    this.load.image("player", "/images/kid_friendly_player.png");
}

// Initialization Code Run On Game Start
function create()
{
    /*
    var logo = this.physics.add.image(400, 100, 'logo');
    var particles = this.add.particles('red');

    var emitter = particles.createEmitter({
        speed: 100,
        scale: { start: 1, end: 0 },
        blendMode: 'ADD'
    });
    logo.setVelocity(100, 200);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);

    emitter.startFollow(logo);
    */

    document.getElementById("run-btn").onclick = runS(this)
    makeGame(this);
}

function runS(g) {
  return function (e) {
    //var logo = g.physics.add.image(400, 100, 'logo');
    // tweenA = g.tweens.add({targets: [logo],  props: { x: 100, y: 100}, duration: 2000, ease: "Quart.easeOut"});
    // var particles = g.add.particles('red');
    // var emitter = particles.createEmitter({
    //   speed: 100,
    //   scale: { start: 1, end: 0 },
    //   blendMode: 'ADD'
    // });
    // emitter.startFollow(logo);
    runSimulation(g);

    // logo.setVelocity(100, 200);
    // logo.setBounce(1, 1);
    // logo.setCollideWorldBounds(true);

    //emitter.startFollow(logo);
  }
}


// Update Code (Runs Every Frame)
function update()
{
    /*
    // Move Left
    if (cursors.left.isDown && !cursors.right.isDown)
        player.setVelocityX(-config.player_speed);

    // Move Right
    if (cursors.right.isDown && !cursors.left.isDown)
        player.setVelocityX(config.player_speed);

    // Move Up
    if (cursors.up.isDown && !cursors.down.isDown)
        player.setVelocityY(-config.player_speed);

    // Move Down
    if (cursors.down.isDown && !cursors.up.isDown)
        player.setVelocityY(config.player_speed);
    */
}
