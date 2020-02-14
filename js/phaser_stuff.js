// Initialize Phaser Game Object
var config =
{
    type: Phaser.AUTO,
    parent: "thecanvas",
    width: 600,
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
    this.load.image("snowball", "/images/football.gif");
    this.load.image("particle", "/images/particle.png"); 
    this.load.image("background", "/images/yeehaw.png");
}

// Initialization Code Run On Game Start
function create()
{
  let image = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background');
  image.setScale(this.cameras.main.width / image.width, 3.25).setScrollFactor(0);

  document.getElementById("run-btn").onclick = startStop(this)

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
      let user = game.code1.getValue()
      localStorage.setItem("code1", user);
      console.log("Player 1 Code Saved!");
    });

    code2.on("change", () => {
      let user = game.code2.getValue()
      localStorage.setItem("code2", user);
      console.log("Player 2 Code Saved!");
    });

    makeGame(this, code1, code2);

    $('#template').change(function (e) {
      $.ajax("/js/templates/"+$('#template').val()+".js", {dataType: "text"}).done(function (data) {
        code2.setValue(data);
      }).fail(function (a, b, c) {
        console.log(c);
      })
    })
}

function startStop(g) {
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
    if (game.turnTimer == null) {
      runSimulation(g);
      document.getElementById("run-btn").innerText = "STOP"
    } else {
      game.manualStop()
      document.getElementById("run-btn").innerText = "Run Code"
    }

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
