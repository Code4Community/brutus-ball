
// This is a complete hack. We are trying to make an asynchronous language
// act synchronously for the sake of teachability.
var take_turn = false;
function queue_turn(info) {

}

function move(distance) {

}

// Tries to evaluate 'code' as a string
function try_eval(code) {
    try {
        self.con
        eval(code)
    } catch (error) {
        // TODO: Send message to browser here
        console.log('error in webworker: ' + error)
    }
}

// Gets messages from the main browser JS thread
self.onmessage = function(e) {
    if (e.data['type'] == 'code') { // todo: make this an enum
        try_eval(e.data['code'])
    }
}
