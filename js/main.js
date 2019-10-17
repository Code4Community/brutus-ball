// This is code that the user entered
var p1Code = "move(); shoot(); move()"
var p2Code = "shoot(); move(); move()"

// global variable to pause execution when the player's turn is over
var stopExecution = false

// Interpreter setup function
var initFunc = function (player) {
  return function(interpreter, scope) {
    interpreter.setProperty(scope, 'url', String(location));

    // Give it a way to print to the console
    var wrapper = function(text) {
      return console.log(text);
    };

    // This is the move function! Set stopExecution to true!
    var moveW = function (size) {
      console.log("Player "+player+" move function executed.");
      stopExecution = true
    }

    // This is the shoot function! Set stopExecution to true!
    var shootW = function (size) {
      console.log("Player "+player+" shoot function executed.");
      stopExecution = true
    }

    // Tell the sandboxed environment how to access these functions
    interpreter.setProperty(scope, 'log',
        interpreter.createNativeFunction(wrapper));
    interpreter.setProperty(scope, 'move',
        interpreter.createNativeFunction(moveW));
    interpreter.setProperty(scope, 'shoot',
        interpreter.createNativeFunction(shootW));
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
