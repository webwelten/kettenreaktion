/**
 *
 * @constructor
 */
var Game = (function Main() {
    "use strict";

    var Game = {},
        $gameCanvas = $("#game-canvas"),
        stats = new Stats();

    // init game canvas
    // set dimensions programmatically to have it responsive
    Game.canvas = $gameCanvas[0];
    Game.canvas.width = parseFloat($gameCanvas.css('width'));
    Game.canvas.height = parseFloat($gameCanvas.css('height'));
    Game.ctx = Game.canvas.getContext('2d');

    /**
     * the element we're placing our input listeners on
     * @type {*|jQuery|HTMLElement}
     */
    Game.$controls = $('#controls');

    // init stats
    $("#fps-stats").append(stats.domElement);

////////////////////////////////////////////////////////////////////////////////

    /**
     * TODO: get the highscore from db
     * @type {number}
     */
    Game.highscore = 0;

    /**
     * holds the ball objects already collided
     * @type {Array}
     */
    Game.collidedBalls = [];

////////////////////////////////////////////////////////////////////////////////

    /**
     *
     */
    Game.init = function() {
        resetGame();
        initLevel();

        mainLoop();
    };

    /**
     * setup new game
     */
    function resetGame() {
        Game.score = 0;
        Game.level = 1;
        Game.lives = 5;
    }

    /**
     * init new level depending on current skills
     */
    function initLevel() {

        Game.millisecs = 0;
        Game.deltaTime = new Date().getTime();
        Game.frameCount = 0;

        Game.newScore = 0;
        Game.reactions = 0;

        Game.ballsCount = 25 - Math.round(Game.level / (3 + Math.round(Math.random() * 5)));
        Game.ballsMin = Math.round(((Game.level * Game.level) + Game.level) / 20 + 5 );

        Game.balls = new Array(Game.ballsCount);
        Game.balls[0] = new StarterBall();
        for (var i = 1; i < Game.ballsCount ;i++) {
            Game.balls[i] = new Ball();
        }

        // COLLISION
        Ball.period = 6000 - 200 * Game.level;
        for (i = 0;i< Game.ballsCount;i++) {
            Game.balls[i].reset();
        }

        //// COLLISION
        Game.collidedBallsCount = 0;
        Game.collidedBalls.length = 0;

        CollisionBox.x1 = 0;
        CollisionBox.y1 = 0;
        CollisionBox.x2 = 0;
        CollisionBox.y2 = 0;
    }

    /**
     *
     */
    function mainLoop() {

        Game.millisecs = new Date().getTime();
        Game.frameCount++;

        Game.deltaTime = (Game.millisecs - Game.lastTimestamp)/1000;
        Game.lastTimestamp = Game.millisecs;

        stats.begin();

        Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
        Game.ctx.globalAlpha = '1.0';

        for (var i = 0; i<Game.ballsCount; i++) {
            if (Game.balls[i].isAlive) {
                Game.balls[i].update();
                Game.balls[i].draw();
            }
        }

        CollisionBox.draw();
        stats.end();
        window.requestAnimFrame(mainLoop);
    }

    return Game;
})();