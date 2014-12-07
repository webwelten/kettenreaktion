/**
 * StarterBall
 * @constructor
 */
function StarterBall () {
    this.id = 0;
}

StarterBall.alpha = 40;
StarterBall.size = 40;
StarterBall.size2 = 55;

////////////////////////////////////////////////////////////////////////////////

StarterBall.prototype.reset = function () {
    this.x = 0;
    this.y = 0;

    this.size = StarterBall.size;
    this.sizePow2 = Math.pow(StarterBall.size2, 2);
    this.period = Ball.period;
    this.color = '#000';

    this.isAlive = true;
    /**
     * wether put on the game field or not
     * @type {boolean}
     */
    this.isPlaced = false;
    this.placedDownTime = 0;
    this.alpha = StarterBall.alpha;

    var that = this;

    Game.MouseHandler.one("click tap", function(e) {

        // ball has been placed down
        that.isPlaced = true;

        // change size
        that.size = StarterBall.size2;
        that.sizePow2 = Math.pow(that.size, 2);

        that.placedDownTime = Game.millisecs;
        that.collisionArrayIndex = Game.collidedBalls.push([that.id]);

        // update CollisionBox
        CollisionBox.x1 = that.getX();
        CollisionBox.x2 = that.x+that.size;

        CollisionBox.y1 = that.getY();
        CollisionBox.y2 = that.y+that.size;

    }).on("mousemove touchmove", function(e) {

        e.preventDefault();

        if (!that.isPlaced) {
            that.x = e.layerX;
            that.y = e.layerY;
        }
    });
};

StarterBall.prototype.getX = function() {
    return (this.x - this.size);
};

StarterBall.prototype.getY = function() {
    return (this.y - this.size);
};

/**
 *
 */
StarterBall.prototype.draw = function () {
    if (this.isAlive) {
        Game.ctx.fillStyle = 'rgba(0,0,0,' + (this.alpha / 100) + ')';
        Ball.drawCircle(this.x, this.y, this.size);
    }
};

/**
 *
 */
StarterBall.prototype.update = function () {

    if (this.isPlaced) {
        // render ball as long as period lasts
        // if over stop colliding with moving balls
        // and set isAlive = false to prevent from rendering

        if (Game.millisecs - this.placedDownTime > this.period) {
            Game.collidedBalls[0] = false;
            this.isAlive = false;
        }
        this.alpha = StarterBall.alpha-((Game.millisecs - this.placedDownTime)/this.period)*StarterBall.alpha;
    }
};