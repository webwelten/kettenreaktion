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

    if (!this.isAlive) {
        return;
    }

    if (!this.isPlaced) {
        this.x = Game.MouseHandler.x;
        this.y = Game.MouseHandler.y;

        if (Game.MouseHandler.mousehit) {
            // ball has been placed down
            this.isPlaced = true;

            // change size
            this.size = StarterBall.size2;
            this.sizePow2 = Math.pow(this.size, 2);

            this.placedDownTime = Game.millisecs;
            this.collisionArrayIndex = Game.collidedBalls.push([this.id]);

            // update CollisionBox
            CollisionBox.x1 = this.getX();
            CollisionBox.x2 = this.x+this.size;

            CollisionBox.y1 = this.getY();
            CollisionBox.y2 = this.y+this.size;
        }

    } else {

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