function Game(p) {
  this.players = []
  this.nextTurn = 0; // index of the next player to process turn
  this.stopExecution = false // used as a flag to stop execution
  this.turnTimer = null
  this.didSomethingThisIteration = false
  this.projectileGroup = null
  this.playerGroup = null

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

  this.checkEndgame = function () {
    var winner = -1;
    for (var idx = 0; idx < this.players.length; idx++) {
      if (this.players[idx].health > 0) {
        if (winner != -1) return;
        winner = idx;
      }
    }
    // There was a winner, or no winner
    if (winner == -1) {
      console.log("TIE")
      alert("TIE");
    } else {
      console.log("PLAYER "+winner+" WON");
      alert("PLAYER "+winner+" WON")
    }
    // Stop interpreting, reset for next time.
    window.clearInterval(g.turnTimer);
    g.didSomethingThisIteration = false;
  }
}

function Player(phaserGame, x, y, name) {
  this.x = x;
  this.y = y;
  this.game = phaserGame
  this.health = 3.0;
  this.sprite = phaserGame.physics.add.image(1337, 1337, 'player');
  this.sprite.scale = .25;
  this.sprite.x = x
  this.sprite.y = y
  this.sprite.c4cPlayer = this
  this.name = name
  this.interpreter = null
  this.codeExecuting = true

  // Moves the tank a little bit in the current direction 
  this.move = function (direction) {
    var dirArr = getDirection(direction)
    this.x += dirArr[0] * 50
    this.y += dirArr[1] * 50
    this.faceDirection(direction)
    tweenA = this.game.tweens.add({targets: [this.sprite],  props: { x: this.x, y: this.y}, duration: 500, ease: "Quart.easeOut"});
  }

  this.shoot = function (direction) {
    var projectile = this.game.physics.add.image(100, 100, 'snowball');
    projectile.x = this.x
    projectile.y = this.y
    var dirArr = getDirection(direction)
    this.faceDirection(direction)
    projectile.setVelocity(dirArr[0]*1500, dirArr[1]*1500)
    projectile.c4cSource = this
    //game.projectileGroup.add(projectile)
    this.game.physics.add.overlap(game.playerGroup, projectile, collisionHandler, collisionChecker);


    var particles = this.game.add.particles('projectile');

    this.projectileEmitter = particles.createEmitter({
        speed: 100,
        scale: { start: 1, end: 0 },
        blendMode: 'ADD',
        tint: 0x666666
        //speedX: 2.0
    });

    this.projectileEmitter.startFollow(projectile)
  }

  // Resets all the player stuff 
  this.clear = function() {
    this.x = x
    this.y = y
    this.health = 3.0
    this.sprite.x = x
    this.sprite.y = y
    this.sprite.visible = true
    this.sprite.body.checkCollision.none = false
    this.sprite.setRotation(0)
    this.codeExecuting = true
    this.interpreter = null // to avoid hard to find bugs
  }

  this.killIfNecessary = function() {
    if (this.health <= 0.0) {
      this.sprite.body.checkCollision.none = true
      this.sprite.visible = false
      game.checkEndgame()

    }
  }

  this.faceDirection = function(dirString) {
    switch (dirString) {
      case "left":
        this.sprite.setRotation(Math.PI)
        break
      case "right":
        this.sprite.setRotation(0)
        break
      case "down":
        this.sprite.setRotation(Math.PI / 2.0)
        break
      case "up":
        this.sprite.setRotation(3.0 * Math.PI / 2.0)
        break
    }
  }
}

function getDirection(dirString) {
  // [Math.sqrt(2.0)/2.0, Math.sqrt(2.0)/2.0]
  switch (dirString) {
    case "left":
      return [-1.0, 0.0]
    case "right":
      return [1.0, 0.0]
    case "down":
      return [0.0, 1.0]
    case "up":
      return [0.0, -1.0]
  }
  console.log("Invalid direction: "+dirString)
  return [0.0, 0.0]
}

var game = new Game()

function collisionHandler(obj1, obj2) {
  console.log("COLLISION")
  if (obj2.c4cPlayer != obj1.c4cSource) {
    obj2.c4cPlayer.health -= 1.0
    obj2.c4cPlayer.killIfNecessary()
    obj1.destroy()
    obj1.c4cSource.projectileEmitter.stop()
  }

}

function collisionChecker(obj1, obj2) {
  //console.log("COLLISION CHECK "+obj2.c4cPlayer.name)
  if (obj2.c4cPlayer != obj1.c4cSource) {
    return true
  }
  return false

}

function makeGame(scene, c1, c2) {
  var source1 = "move(\"right\"); log(testCondition());  skip(); throwSnowball(\"right\"); move(\"up\"); move(\"down\"); for (var x=0; x<5; x++) {throwSnowball(\"right\")}"
  var source2 = "throwSnowball(\"down\"); move(\"up\"); move(\"down\")"
  if (sessionStorage.getItem("code1")) {
    source1 = sessionStorage.getItem("code1")
  }
  if (sessionStorage.getItem("code2")) {
    source2 = sessionStorage.getItem("code2")
  }
  game.code1 = c1
  game.code2 = c2
  game.code1.setValue(js_beautify(source1))
  game.code2.setValue(js_beautify(source2))

  game.projectileGroup = scene.physics.add.group()
  game.playerGroup = scene.physics.add.group()

  game.players.push(new Player(scene, 100.0, 275.0, "Player 1"))
  game.players.push(new Player(scene, 500.0, 275.0, "Player 2"))
  
  game.playerGroup.add(game.players[0].sprite)
  game.playerGroup.add(game.players[1].sprite)

  //scene.physics.add.overlap(game.playerGroup, game.projectileGroup, collisionHandler, collisionChecker);

} 

function runSimulation(scene) {
  // This is code that the user entered

  var p1Code = game.code1.getValue()
  var p2Code = game.code2.getValue()

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
      var moveW = function (direction) {
        console.log("Player "+player.name+" move function executed in direction "+direction);
        player.move(direction);
        game.stopExecution = true
      }

      // This is the throwSnowball function! Set stopExecution to true!
      var throwSnowballW = function (direction) {
        console.log("Player "+player.name+" throwSnowball "+direction+".");
        player.shoot(direction)
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
  
  game.turnTimer = setInterval(game.processNextTurn, 750);
}

(function() {
  // document.getElementById("code1").value =  "move(); log(testCondition()); turn(\"left\"); skip(); throwSnowball(\"left\"); move()"
  // document.getElementById("code2").value = "throwSnowball(\"down\"); turn(\"right\"); move(); move()"

})();

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
