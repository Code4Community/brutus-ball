let MAX_X = 725
let MAX_Y = 325
function Game(p) {
  this.players = []
  this.nextTurn = 0; // index of the next player to process turn
  this.stopExecution = false // used as a flag to stop execution
  this.turnTimer = null
  this.didSomethingThisIteration = false
  this.projectileGroup = null
  this.playerGroup = null
  this.logStr = "";
  this.roundID = 1
  this.eventCount = 1;

  g = this
  this.processNextTurn = function () {
    if (processTurn(g.players[g.nextTurn])) {
      g.didSomethingThisIteration = true
    }
    g.nextTurn = (g.nextTurn + 1);
    if (g.nextTurn >= g.players.length) {
      g.nextTurn = 0
      g.roundID++;
      if (!g.didSomethingThisIteration) {
        console.log("---- END")
        g.manualStop()
      }
      g.didSomethingThisIteration = false
    }
  }

  this.checkEndgame = function () {
    var winner = -1;
    for (var idx = 0; idx < this.players.length; idx++) {
      if (this.players[idx].health < 3) {
        if (winner != -1) return;
        winner = idx;
      }
    }
    // There was a winner, or no winner
    if (winner == -1) {
      console.log("TIE")
      g.logStr += "TIE\n"
      g.logStr += "\n------\n"
      //alert("TIE");
    } else {
      console.log("PLAYER " + (winner + 1) + " WON");
      g.logStr += "PLAYER " + (winner + 1) + " WON\n"
      g.logStr += "\n------\n"
      if (winner == 0) {
        $('#score').text('Yay! OSU won!')
      } else {
        $('#score').text('Oh no! Michigan won.')
      }
      //alert("PLAYER " + (winner + 1) + " WON")
    }
    // Stop interpreting, reset for next time.
    this.manualStop()
  }

  this.manualStop = function () {
    window.clearInterval(g.turnTimer);
    g.turnTimer = null
    g.didSomethingThisIteration = false;
    this.roundID = 1;
    this.eventCount = 1;
    document.getElementById("run-btn").innerText = "Kickoff!"
  }

  this.log = function (player, str) {
    this.logStr += (player.name+" turn "+this.roundID+": "+str+"\n")
    // document.getElementById("logArea").innerHTML = this.logStr
  }

  this.addEvent = function (player, imgHTML, textHTML) {
    $('#actions').prepend(`<tr><td scope="row">${this.eventCount}</td><td scope="row">${player}</td><td>${textHTML}</td><td>${this.players[1].health}</td><td>${this.players[0].health}</td></tr>`)
    this.eventCount += 1
  }

  this.updateWinIndicator = function () {
    // $('#winIndicator').toggle(true)
    // if (this.players[1].health > this.players[0].health) {
    //   $('#winIndicator').html(`<h3>Ohio State up ${this.players[1].health}-${this.players[0].health}</h3>`)
    // } else if (this.players[0].health > this.players[1].health) {
    //   $('#winIndicator').html(`<h3>Michigan up ${this.players[0].health}-${this.players[1].health}</h3>`)
    // } else {
    //   $('#winIndicator').html(`<h3>Tied ${this.players[1].health}-${this.players[0].health}</h3>`)
    // }
    $("#osuScore").text(this.players[1].health)
    $("#michiganScore").text(this.players[0].health)
  }
}

function Player(phaserGame, x, y, name, sprite) {
  this.x = x;
  this.y = y;
  this.game = phaserGame
  this.health = 0.0;
  this.sprite = phaserGame.physics.add.image(1337, 1337, sprite);  
  Object.assign(this, Phaser.GameObjects.Components. Flip);
  // this.sprite.scale = .2;
  this.sprite.scaleY = .3; 
  this.sprite.scaleX = .2;
  this.sprite.x = x
  this.sprite.y = y
  this.sprite.c4cPlayer = this
  this.name = name
  this.interpreter = null
  this.codeExecuting = true 
  this.markedText = null

  this.BOOM_emitter = this.game.add.particles('particle').createEmitter({
    x: this.x,
    y: this.y,
    speed: { min: -200, max: 200 },
    angle: { min: 0, max: 360 },
    scale: { start: 5.3, end: 0 },
    blendMode: 'SCREEN',
    frequency: -1,
    lifespan: 500,
    gravityY: 100,
});

  // Moves the tank a little bit in the current direction 
  this.move = function (direction) {
    var dirArr = getDirection(direction)
    this.x += dirArr[0] * 50
    this.y += dirArr[1] * 50
    this.fixBounds()
    this.faceDirection(direction)
    tweenA = this.game.tweens.add({ targets: [this.sprite], props: { x: this.x, y: this.y }, duration: 500, ease: "Quart.easeOut" });
  }

  this.fixBounds = function () {
    if (this.x <= 0) {
      this.x = 0
    } else if (this.x > MAX_X) {
      this.x = MAX_X
    }
    if (this.y <= 0) {
      this.y = 0
    } else if (this.y > MAX_Y) {
      this.y = MAX_Y
    }
  }

  this.shoot = function (direction) {
    var projectile = this.game.physics.add.image(100, 100, 'snowball');
    projectile.x = this.x
    projectile.y = this.y
    projectile.scale = 0.1
    var dirArr = getDirection(direction)
    projectile.setRotation(Math.atan(dirArr[1] / dirArr[0]))
    this.faceDirection(direction)
    projectile.setVelocity(dirArr[0] * 500, dirArr[1] * 500)
    projectile.c4cSource = this
    //game.projectileGroup.add(projectile)
    this.game.physics.add.overlap(game.playerGroup, projectile, collisionHandler, collisionChecker);


    var particles = this.game.add.particles('particle');

    this.projectileEmitter = particles.createEmitter({
      name: "particle",
      speed: 50,
      scale: { start: 2.0, end: 0 },
      blendMode: 'ADD',
      tint: 0x666666
      //speedX: 2.0
    });

    this.projectileEmitter.startFollow(projectile)
  }

  // Resets all the player stuff 
  this.clear = function () {
    this.x = x
    this.y = y
    this.health = 0.0
    this.sprite.x = x
    this.sprite.y = y
    this.sprite.visible = true
    this.sprite.body.checkCollision.none = false
    this.sprite.setRotation(0)
    this.codeExecuting = true
    this.interpreter = null // to avoid hard to find bugs
  }

  this.killIfNecessary = function () {
    if (this.health >= 3.0) {
      this.sprite.body.checkCollision.none = true
      this.sprite.visible = false
      game.checkEndgame()

    }
  }

  this.faceDirection = function (dirString) {
    return // don't change direction right now
    switch (dirString) {
      case "left":
        this.sprite.setRotation(0)
        this.sprite.flipX = true;
        this.changeScale(0)
        break
      case "right":
        this.sprite.flipX = false;
        this.sprite.setRotation(0)
        this.changeScale(0)
        break
      case "down":
        this.sprite.flipX = false;
        this.sprite.setRotation(Math.PI / 2.0)
        this.changeScale(1)
        break
      case "up":
        this.sprite.flipX = false;
        this.sprite.setRotation(3.0 * Math.PI / 2.0)
        this.changeScale(1)
        break
    }
  }

  this.changeScale = function (n) {
    switch (n) {
      case 0:
        this.sprite.scaleY = .3; 
        this.sprite.scaleX = .2;
        break
      case 1:
        this.sprite.scaleY = .2; 
        this.sprite.scaleX = .3;
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
  console.log("Invalid direction: " + dirString)
  return [0.0, 0.0]
}

var game = new Game()

function collisionHandler(obj1, obj2) {
  console.log("COLLISION")
  if (obj2.c4cPlayer != obj1.c4cSource) {
    obj2.c4cPlayer.health += 1.0
    
    g.log(obj2.c4cPlayer, "was hit");
    g.addEvent(obj2.c4cPlayer.name, "Hit!", `${obj2.c4cPlayer.name} was hit!`)
    g.updateWinIndicator();

    obj2.c4cPlayer.killIfNecessary()
    obj1.destroy()
    obj1.c4cSource.projectileEmitter.stop()

    obj2.c4cPlayer.BOOM_emitter.setPosition(obj2.c4cPlayer.x, obj2.c4cPlayer.y)
    obj2.c4cPlayer.BOOM_emitter.explode(10);
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
  var source1 = ""//"throwFootball(\"right\")\nmove(\"up\")\nmove(\"up\")\nthrowFootball(\"right\")\nthrowFootball(\"right\")\nthrowFootball(\"right\")\nthrowFootball(\"right\")\nthrowFootball(\"right\")"
  var source2 = ""//"throwFootball(\"down\")\nmove(\"up\")\nmove(\"down\")"
  if (localStorage.getItem("code1")) {
    source1 = localStorage.getItem("code1")
  }
  if (localStorage.getItem("code2")) {
    source2 = localStorage.getItem("code2")
    console.log(source2)

  }
  game.code1 = c1
  game.code2 = c2
  game.code1.setValue(js_beautify(source1))
  game.code2.setValue(js_beautify(source2))

  game.projectileGroup = scene.physics.add.group()
  game.playerGroup = scene.physics.add.group()

  game.players.push(new Player(scene, 150.0, 175.0, "Ohio State", "player"))
  game.players.push(new Player(scene, 600.0, 175.0, "Michigan", "umich"))

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

  $('#actions').empty();

  $("#osuScore").text("0")
  $("#michiganScore").text("0")
  $("#score").html('<div id="score"><div>Ohio State: <span id="osuScore"></span></div><div>Michigan: <span id="michiganScore"></span></div></div>')

  //var p1Code = "move(); log(testCondition()); turn(\"left\"); skip(); throwFootball(\"left\"); move()"
  //var p2Code = "throwFootball(\"down\"); turn(\"right\"); move(); move()"

  // Interpreter setup function
  var initFunc = function (player) {
    return function (interpreter, scope) {
      interpreter.setProperty(scope, 'url', String(location));

      // Give it a way to print to the console
      var wrapper = function (text) {
        console.log("Player " + player.name + " log: " + text);
        return game.log(player, text)
      }

      // Left / right / up / down
      var turnW = function (direction) {
        console.log("Player " + player.name + " turn " + direction + ".");
        game.stopExecution = true;
      }

      // This is the move function! Set stopExecution to true!
      var moveW = function (direction) {
        console.log("Player " + player.name + " move function executed in direction " + direction);
        game.addEvent(player.name, "Move", "Move "+direction)
        player.move(direction);
        game.stopExecution = true
      }

      // This is the throwFootball function! Set stopExecution to true!
      var throwFootballW = function (direction) {
        console.log("Player " + player.name + " throwFootball " + direction + ".");
        game.addEvent(player.name, "Throw", "Throw "+direction)
        player.shoot(direction)
        game.stopExecution = true
      }

      var skipW = function () {
        console.log("Player " + player.name + " skipped turn.");
        game.addEvent(player.name, "Skip", "Skipped turn.")
        game.stopExecution = true;
      }

      var playerXW = function () {
        return player.x;
      }

      var playerYW = function () {
        return player.y;
      }

      var enemyXW = function () {
        // Get a reference to the other player object 
        let otherPlayer = game.players[0] == player ? game.players[1] : game.players[0];
        return otherPlayer.x
      }

      var enemyYW = function () {
        // Get a reference to the other player object 
        let otherPlayer = game.players[0] == player ? game.players[1] : game.players[0];
        return otherPlayer.y;
      }

      var getDirectionW = function() {
        if (player.getDirection() = [-1.0, 0.0]) {
          return "left"
        } else if (player.getDirection() = [1.0, 0.0]) {
          return "right"
        } else if (player.getDirection() = [0.0, 1.0]) {
          return "up"
        } else {
          return "down"
        }
      }

      var getEnemyDirectionW = function() {
        let otherPlayer = game.players[0] == player ? game.players[1] : game.players[0];
        if (otherPlayer.getDirection() = [-1.0, 0.0]) {
          return "left"
        } else if (otherPlayer.getDirection() = [1.0, 0.0]) {
          return "right"
        } else if (otherPlayer.getDirection() = [0.0, 1.0]) {
          return "up"
        } else {
          return "down"
        }
      }

      // Tell the sandboxed environment how to access these functions
      interpreter.setProperty(scope, 'log',
        interpreter.createNativeFunction(wrapper));
      interpreter.setProperty(scope, 'move',
        interpreter.createNativeFunction(moveW));
      interpreter.setProperty(scope, 'throwFootball',
        interpreter.createNativeFunction(throwFootballW));
      // interpreter.setProperty(scope, 'turn',
      //   interpreter.createNativeFunction(turnW));
      interpreter.setProperty(scope, 'skip',
        interpreter.createNativeFunction(skipW));
      interpreter.setProperty(scope, 'playerX',
        interpreter.createNativeFunction(playerXW));
      interpreter.setProperty(scope, 'playerY',
        interpreter.createNativeFunction(playerYW));
      interpreter.setProperty(scope, 'enemyX',
        interpreter.createNativeFunction(enemyXW));
      interpreter.setProperty(scope, 'enemyY',
        interpreter.createNativeFunction(enemyYW));
      interpreter.setProperty(scope, "getDirection",
        interpreter.createNativeFunction(getDirectionW));
      interpreter.setProperty(scope, "getEnemyDirection", 
        interpreter.createNativeFunction(getEnemyDirectionW));
    };
  }

  // Make an interpreter for each player
  try {
    var interpreter1 = new Interpreter(p1Code, initFunc(game.players[0]));
  } catch (e) {
    alert("You have a syntax error in your code for Ohio State! Check parentheses () and quotes \"\"")
    game.manualStop()
    return
  }
  game.players[0].interpreter = interpreter1;

  try {
    var interpreter2 = new Interpreter(p2Code, initFunc(game.players[1]));
  } catch (e) {
    alert("You have a syntax error in your code for Michigan! Check parentheses () and quotes \"\"")
    game.manualStop()
    return
  }
  game.players[1].interpreter = interpreter2;
  
  game.turnTimer = setInterval(game.processNextTurn, 1000);
}

(function () {
  // document.getElementById("code1").value =  "move(); log(testCondition()); turn(\"left\"); skip(); throwFootball(\"left\"); move()"
  // document.getElementById("code2").value = "throwFootball(\"down\"); turn(\"right\"); move(); move()"

})();

function processTurn(player) {
  if (!player.codeExecuting) {
    // Go to the next turn
    return
  }

  console.log("Start turn: " + player.name);
  game.stopExecution = false
  i1 = true;

  counter = 100000
  while (i1 && !game.stopExecution && counter > 0) {
    counter -= 1
    try {
      i1 = player.interpreter.step()
    } catch (e) {
      game.addEvent(player.name, "ERROR", "ERROR: "+e)
      break;
    }
  }
  if (counter == 0) {
    game.log(player, "Turn Timed Out (You have an infinite loop!)")
  }

  console.log("End turn: " + player.name + " " + i1);
  player.codeExecuting = i1

  // if (player == game.players[0]) {
  //   var node = player.interpreter.stateStack[myInterpreter.stateStack.length - 1].node;
  //   var start = node.start;
  //   // Find line number

  //   // var end = node.end;
  //   player.markedText = code1.getDoc().markText({line:i,ch:0},{line:i,ch:lines[i].length},{css: "background-color: yellow"});
  // }

  return player.codeExecuting
}

//run();
