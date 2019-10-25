function Game() {
  this.players = []
}

function Player() {
  this.x = 0.0;
  this.y = 0.0;
  this.health = 5.0;
  var logo = game.physics.add.image(400, 100, 'logo');
}



function runSimulation(scene) {
  // This is code that the user entered

  var p1Code = document.getElementById("code1").value
  var p2Code = document.getElementById("code2").value
  //var p1Code = "move(); log(testCondition()); turn(\"left\"); skip(); throwSnowball(\"left\"); move()"
  //var p2Code = "throwSnowball(\"down\"); turn(\"right\"); move(); move()"

  // global-ish variable to pause execution when the player's turn is over
  var stopExecution = false

  // Interpreter setup function
  var initFunc = function (player) {
    return function(interpreter, scope) {
      interpreter.setProperty(scope, 'url', String(location));

      // Give it a way to print to the console
      var wrapper = function(text) {
        return console.log("Player "+player+" log: "+text);
      };

      // Left / right / up / down
      var turnW = function (direction) {
        console.log("Player "+player+" turn "+direction+".");
        stopExecution = true;
      }

      // This is the move function! Set stopExecution to true!
      var moveW = function () {
        console.log("Player "+player+" move function executed.");
        stopExecution = true
      }

      // This is the throwSnowball function! Set stopExecution to true!
      var throwSnowballW = function (direction) {
        console.log("Player "+player+" throwSnowball "+direction+".");
        stopExecution = true
      }

      var skipW = function () {
        console.log("Player "+player+" skipped turn.");
        stopExecution = true;
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

  var interpreter1 = new Interpreter(p1Code, initFunc(1));
  var interpreter2 = new Interpreter(p2Code, initFunc(2));


  // Game loop!
  var i1 = true;
  var i2 = true;
  while (i1 || i2) {
    console.log("Player 1's turn...")
    stopExecution = false
    while (i1 && !stopExecution) {
      i1 = interpreter1.step() // returns false when script ends
    }
    console.log("Player 2's turn...")
    stopExecution = false
    while (i2 && !stopExecution) {
      i2 = interpreter2.step() // returns false when script ends
    }
  }
  console.log("Done")

}

(function() {
  document.getElementById("code1").value =  "move(); log(testCondition()); turn(\"left\"); skip(); throwSnowball(\"left\"); move()"
  document.getElementById("code2").value = "throwSnowball(\"down\"); turn(\"right\"); move(); move()"

})();


//run();
