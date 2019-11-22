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
  this.cameras.main.backgroundColor.setTo(200, 200, 200);

  document.getElementById("run-btn").onclick = runS(this)

  var code1 = CodeMirror(document.getElementById("code1"), {
    lineNumbers: true,
    mode: "javascript", 
  });

  var code2 = CodeMirror(document.getElementById("code2"), {
    lineNumbers: true,
    mode: "javascript"
  });

  // When the text field changes, mirror it to the end object 
  code1.on("change", () => {
    let user = document.getElementById("code1").value;
    sessionStorage.setItem("code1", user);
    console.log("Player 1 Code Saved!");
  });

  code2.on("change", () => {
    let user = document.getElementById("code2").value;
    sessionStorage.setItem("code2", user);
    console.log("Player 2 Code Saved!");
  });

  makeGame(this, code1, code2);
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
}
