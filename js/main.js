function Game(p) {
  this.players = []
  this.nextTurn = 0; // index of the next player to process turn
  this.stopExecution = false // used as a flag to stop execution
  this.turnTimer = null
  this.didSomethingThisIteration = false

  g = this
  this.processNextTurn = function () {
    if (processTurn(g.players[g.nextTurn])) {
      g.didSomethingThisIteration = true
    }
    g.nextTurn = ( g.nextTurn + 1 );
    if (g.nextTurn >= g.players.length) {
      g.nextTurn = 0
      if (!g.didSomethingThisIteration) {
        console.log("---- END")
        window.clearInterval(g.turnTimer);
      }
      g.didSomethingThisIteration = false
    }
  }
}

function Player(game, x, y, name) {
  this.x = x;
  this.y = y;
  this.game = game
  this.health = 5.0;
  this.sprite = game.physics.add.image(400, 100, 'player');
  this.sprite.scale = .3;
  this.sprite.x = x
  this.sprite.y = y
  this.name = name
  this.interpreter = null
  this.codeExecuting = true

  // Moves the tank a little bit in the current direction 
  this.move = function (x) {
    this.x += 20
    tweenA = this.game.tweens.add({targets: [this.sprite],  props: { x: this.x, y: this.y}, duration: 500, ease: "Quart.easeOut"});
  }


  this.shoot = function (direction) {
    var particles = this.game.add.particles('projectile');

    var emitter = particles.createEmitter({
        speed: 100,
        scale: { start: 1, end: 0 },
        blendMode: 'ADD',
        tint: 0x666666,
        x: this.x,
        y: this.y,
        //speedX: 2.0
    });
  }

  // Resets all the player stuff 
  this.clear = function() {
    this.x = x
    this.y = y
    this.sprite.x = x
    this.sprite.y = y
    this.codeExecuting = true
    this.interpreter = null // to avoid hard to find bugs
  }
}

var game = new Game()
function makeGame(scene) {
  game.players.push(new Player(scene, 100.0, 275.0, "Player 1"))
  game.players.push(new Player(scene, 500.0, 275.0, "Player 2"))
} 

function runSimulation(scene) {
  // This is code that the user entered

  var p1Code = document.getElementById("code1").value
  var p2Code = document.getElementById("code2").value

  for (player of game.players) {
    player.clear()
  }
  
  //var p1Code = "move(); log(testCondition()); turn(\"left\"); skip(); throwSnowball(\"left\"); move()"
  //var p2Code = "throwSnowball(\"down\"); turn(\"right\"); move(); move()"

  // Interpreter setup function
  var initFunc = function (player) {
    return function(interpreter, scope) {
      interpreter.setProperty(scope, 'url', String(location));

      // Give it a way to print to the console
      var wrapper = function(text) {
        return console.log("Player "+player.name+" log: "+text);
      }

      // Left / right / up / down
      var turnW = function (direction) {
        console.log("Player "+player.name+" turn "+direction+".");
        game.stopExecution = true;
      }

      // This is the move function! Set stopExecution to true!
      var moveW = function () {
        console.log("Player "+player.name+" move function executed.");
        player.move();
        game.stopExecution = true
      }

      // This is the throwSnowball function! Set stopExecution to true!
      var throwSnowballW = function (direction) {
        console.log("Player "+player.name+" throwSnowball "+direction+".");
        player.shoot()
        game.stopExecution = true
      }

      var skipW = function () {
        console.log("Player "+player.name+" skipped turn.");
        game.stopExecution = true;
      }

      var conditionW = function () {
        // TODO: Implement conditions the kids can use
        // to add if statements to their code

        // note: stopExecution is not set here
        return Math.random();
      }

      // Tell the sandboxed environment how to access these functions
      interpreter.setProperty(scope, 'log',
          interpreter.createNativeFunction(wrapper));
      interpreter.setProperty(scope, 'move',
          interpreter.createNativeFunction(moveW));
      interpreter.setProperty(scope, 'throwSnowball',
          interpreter.createNativeFunction(throwSnowballW));
      interpreter.setProperty(scope, 'turn',
          interpreter.createNativeFunction(turnW));
      interpreter.setProperty(scope, 'skip',
          interpreter.createNativeFunction(skipW));
      interpreter.setProperty(scope, 'testCondition',
          interpreter.createNativeFunction(conditionW));
    };
  }

  // Make an interpreter for each player

  var interpreter1 = new Interpreter(p1Code, initFunc(game.players[0]));
  game.players[0].interpreter = interpreter1;
  var interpreter2 = new Interpreter(p2Code, initFunc(game.players[1]));
  game.players[1].interpreter = interpreter2;




  // // Game loop!
  // var i1 = true;
  // var i2 = true;
  // while (i1 || i2) {
  //   console.log("Player 1's turn...")
  //   stopExecution = false
  //   while (i1 && !stopExecution) {
  //     i1 = interpreter1.step() // returns false when script ends
  //   }
  //   console.log("Player 2's turn...")
  //   stopExecution = false
  //   while (i2 && !stopExecution) {
  //     i2 = interpreter2.step() // returns false when script ends
  //   }
  // }
  // console.log("Done")

  game.turnTimer = setInterval(game.processNextTurn, 500);


  // var moreToDo = true
  // while (moreToDo) {
  //   moreToDo = false
  //   for (p of game.players) {
  //     if (processTurn(p)) {
  //       moreToDo = true
  //     }
  //   }
  // }
}

(function() {
  document.getElementById("code1").value =  "move(); log(testCondition()); turn(\"left\"); skip(); throwSnowball(\"left\"); move()"
  document.getElementById("code2").value = "throwSnowball(\"down\"); turn(\"right\"); move(); move()"

})();

if (sessionStorage["code1"]) {
    document.getElementById("code1").value = sessionStorage["code1"];
}

if (sessionStorage["code2"]) {
    document.getElementById("code2").value = sessionStorage["code2"];
}

document.getElementById("save1").addEventListener("click", function () {
    var user = document.getElementById("code1").value ;
    sessionStorage.setItem("code1", user) ;
    console.log("Player 1 code saved")
} , false);

document.getElementById("save2").addEventListener("click", function () {
    var user = document.getElementById("code2").value ;
    sessionStorage.setItem("code2", user) ;
    console.log("Player 2 code saved")
} , false);

function processTurn(player) {
  if (!player.codeExecuting) {
    // Go to the next turn
    return
  }

  console.log("Start turn: "+player.name);
  game.stopExecution = false
  i1 = true;

  while (i1 && !game.stopExecution) {
    i1 = player.interpreter.step()
  }

  console.log("End turn: "+player.name+" "+i1);
  player.codeExecuting = i1
  return player.codeExecuting
}


//run();
