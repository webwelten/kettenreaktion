/**
 *
 * @constructor
 */
var Game = (function Main() {
    "use strict";

    var Game = {};

    var FPS = 33;
    Game.canvas = document.getElementById('game-canvas');
    Game.ctx = Game.canvas.getContext('2d');
    Game.MouseHandler = new MouseHandler( document.getElementById('demo2'));
    Game.clock = new Date();

    Game.stats = new Stats();
    document.getElementById("FPS_STATS").appendChild(Game.stats.domElement);

////////////////////////////////////////////////////////////////////////////////

    Game.userName = "Michael";
    Game.highscore = 0;
    Game.started = false;
    Game.collidedBalls = [];

    Game.notification = [];

////////////////////////////////////////////////////////////////////////////////

    /**
     *
     */
    Game.init = function() {
        resetGame();
        initLevel();

        updateLoop();
        drawLoop();
    };

    /**
     *
     */
    function resetGame() {

        Game.score = 0;
        Game.level = 1;
        Game.lives = 5;
        Game.one_up = 0;
    }

    /**
     *
     */
    function initLevel() {

        Game.millisecs = 0;
        Game.deltaTime = Game.clock.getTime();
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

        Game.notification.length = 0;

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
    function updateLoop() {

        Game.clock = new Date();
        Game.millisecs = Game.clock.getTime();
        Game.MouseHandler.update();
        Game.frameCount++;

        Game.deltaTime = (Game.millisecs - Game.lastTimestamp)/1000;
        Game.lastTimestamp = Game.millisecs;

        for (var i = 0; i<Game.ballsCount; i++) {
            if (Game.balls[i].isAlive) {
                Game.balls[i].update();
            }
        }

        setTimeout(updateLoop, 1000/FPS);
    }

    /**
     *
     */
    function drawLoop() {
        Game.stats.begin();
        window.requestAnimFrame(drawLoop);

        Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
        Game.ctx.globalAlpha = '1.0';

        for (var i = 0; i<Game.ballsCount; i++) {
            if (Game.balls[i].isAlive) {
                Game.balls[i].draw();
            }
        }

        CollisionBox.draw();
        Game.stats.end();
    }

    return Game;
})();