import Phaser from "phaser";
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript.js";

import playerImage from "../images/kid_friendly_player.png";
import umichImage from "../images/block-m.png";
import snowballImage from "../images/football.gif";
import particleImage from "../images/particle.png";
import backgroundImage from "../images/yeehaw.png";

import circlesTemplate from "./templates/circles.js?raw";
import followTemplate from "./templates/follow.js?raw";
import shootTemplate from "./templates/shoot.js?raw";

import { makeGame, runSimulation, g } from "./main.js";

import "./css/style.css";

// Initialize Phaser Game Object
var config = {
  type: Phaser.AUTO,
  parent: "thecanvas",
  width: 768,
  height: 370,

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

var code1;
var code2;

// Used to load required images
function preload() {
    this.load.image("player", playerImage);
    this.load.image("umich", umichImage);
    this.load.image("snowball", snowballImage);
    this.load.image("particle", particleImage); 
    this.load.image("background", backgroundImage);
}

// Initialization Code Run On Game Start
function create() {
  let image = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background');
  image.setScale(this.cameras.main.width / image.width, .4).setScrollFactor(0);

  document.getElementById("run-btn").onclick = startStop(this)

  code1 = CodeMirror(document.getElementById("code1"), {
    lineNumbers: true,
    mode: "javascript"
  });

  code2 = CodeMirror(document.getElementById("code2"), {
    lineNumbers: true,
    mode: "javascript",
    readOnly: "nocursor"
  });

  // When the text field changes, mirror it to the end object 
  code1.on("change", () => {
    let user = code1.getValue();
    localStorage.setItem("code1", user);
    console.log("Player 1 Code Saved!");
  });

  code2.on("change", () => {
    let user = code2.getValue();
    localStorage.setItem("code2", user);
    console.log("Player 2 Code Saved!");
  });

  document.getElementById("easy-btn").onclick = makeTemplateChanger(code2, shootTemplate);
  document.getElementById("medium-btn").onclick = makeTemplateChanger(code2, circlesTemplate);
  document.getElementById("hard-btn").onclick = makeTemplateChanger(code2, followTemplate);

  makeGame(this, code1, code2);
}

function makeTemplateChanger(editor, template) {
  return () => {
    editor.setValue(template);
  };
}

function startStop(scene) {
  return function () {
    //var logo = g.physics.add.image(400, 100, 'logo');
    // tweenA = g.tweens.add({targets: [logo],  props: { x: 100, y: 100}, duration: 2000, ease: "Quart.easeOut"});
    // var particles = g.add.particles('red');
    // var emitter = particles.createEmitter({
    //   speed: 100,
    //   scale: { start: 1, end: 0 },
    //   blendMode: 'ADD'
    // });
    // emitter.startFollow(logo);
    if (g.turnTimer == null) {
      document.getElementById("run-btn").innerText = "STOP";
      runSimulation(scene);
    } else {
      g.manualStop();
      document.getElementById("run-btn").innerText = "Kickoff!";
    }

    // logo.setVelocity(100, 200);
    // logo.setBounce(1, 1);
    // logo.setCollideWorldBounds(true);

    //emitter.startFollow(logo);
  }
}

// Update Code (Runs Every Frame)
function update() {
}
