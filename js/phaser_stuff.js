// Initialize Phaser Game Object
var config =
{
    type: Phaser.AUTO,
    parent: "thecanvas",
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
    },
    scene: {
        preload: preload,
        create: create
    }
};
var game = new Phaser.Game(config);

// Used to load required images
function preload()
{
    this.load.setBaseURL("localhost:5500");
    this.load.image("player", "./images/player.png");
}

// Initialization Code Run On Game Start
function create()
{
    this.add.image(100, 100, "player");
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
