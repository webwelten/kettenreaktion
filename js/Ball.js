/**
 * Ball
 * @constructor
 */
function Ball () {
    this.id = Ball.ObjCount++;
}

Ball.ObjCount = 1;

Ball.colorsHEX = [
    '#3366FF',
    '#FFCC00',
    '#F54312' ,
    '#008C21',
    '#6699FF',
    '#3366FF'
];

Ball.colorsRGB = [
    '50,100,255',
    '255,200,0',
    '245,70,20',
    '0,140,30',
    '100,150,255',
    '50,100,255'
];

Ball.size = 10;
Ball.size2 = 55;
Ball.speed = 2;
Ball.period = 5000;
Ball.alpha = 60;

Ball.drawCircle = function(x, y, size) {
    Game.ctx.beginPath();
    Game.ctx.arc(x, y, size, 0, Math.PI*2, true);
    Game.ctx.closePath();
    Game.ctx.fill();
};

////////////////////////////////////////////////////////////////////////////////

Ball.prototype.reset = function () {

    this.isAlive = true;
    this.collisionTime = 0;
    this.collisionArrayIndex = false;
    this.alpha = Ball.alpha;
    this.speed = Ball.speed;
    this.size = Ball.size;
    this.sizePow2 = Math.pow(Ball.size2, 2);

    // random position and direction
    this.x = Ball.size + 5 + Math.round((Math.random()*( Game.canvas.width -Ball.size-20) ));
    this.y = Ball.size + 5 + Math.round((Math.random()*( Game.canvas.height-Ball.size-20) ));
    this.direction = Math.random()*360;
    this.oldDirection = 0;
    this.directionX = Math.round(Math.cos(this.direction)*10)/10;
    this.directionY = Math.round(Math.sin(this.direction)*10)/10;

    // random color
    this.color = Ball.colorsRGB[0 + Math.round(Math.random()*5)];
    this.colorStr = this.getColor();
};

////////////////////////////////////////////////////////////////////////////////

Ball.prototype.getX = function() {
    return (this.x - this.size);
};

Ball.prototype.getY = function() {
    return (this.y - this.size);
};

Ball.prototype.getColor = function() {
    return 'rgba('+this.color +','+this.alpha/100+')';
};

/**
 *
 */
Ball.prototype.draw = function () {
    if (this.isAlive) {
        Game.ctx.fillStyle = this.getColor();
        Ball.drawCircle(this.x, this.y, this.size);
    }
};

/**
 *
 */
Ball.prototype.update = function () {

    if (!this.isAlive) {
        return;
    }

    if (this.collisionTime == 0) {

        this.x += this.directionX * this.speed;
        this.y += this.directionY * this.speed;

        // Wall Collide
        this.checkWallCollision();

        var score;

        // 1. check: is ball rect in CollisionBox rect
        if (
            Game.frameCount % 2 == 0 &&
            this.speed > 0
            &&
            Collision.rectsOverlap(
                this.getX(),
                this.getY(),
                2*this.size, 2*this.size,
                CollisionBox.x1,
                CollisionBox.y1,
                CollisionBox.x2-CollisionBox.x1,
                CollisionBox.y2-CollisionBox.y1
            )
        ) {

            // check if collided with one of the collidedBalls
            var ballId;
            for(var i=0, len=Game.collidedBalls.length;i<len;i++) {

                if (this.speed == 0 ||  Game.collidedBalls[i] === false) {
                    continue;
                }

                ballId = Game.collidedBalls[i][0];

                // 2. check: for overlaping rects
                if (!Collision.rectsOverlap(
                        this.getX(), this.getY(), this.size*2, this.size*2,
                        Game.balls[ballId].getX(),
                        Game.balls[ballId].getY(),
                        Game.balls[ballId].size*2,
                        Game.balls[ballId].size*2 ) ) {
                    continue;
                }

                // 3. check: for exact overlaping balls
                if (this.overlaps(Game.balls[ballId])) {

                    this.collisionTime = Game.millisecs;
                    this.speed = 0;
                    this.size = Ball.size2;

                    score = Game.balls[ballId].alpha;
                    Game.newScore += Score.getScore(score);

                    // update CollisionBox
                    if (this.getX() < CollisionBox.x1) {
                        CollisionBox.x1 = this.getX();
                    }
                    if (this.x+this.size > CollisionBox.x2) {
                        CollisionBox.x2 = this.x+this.size;
                    }
                    if (this.getY() < CollisionBox.y1) {
                        CollisionBox.y1 = this.getY();
                    }
                    if (this.y+this.size > CollisionBox.y2) {
                        CollisionBox.y2 = this.y+this.size;
                    }

                    // add to collisionArray
                    this.collisionArrayIndex = Game.collidedBalls.push([this.id, score])-1;
                    Game.collidedBallsCount++;
                    Game.reactions++;
                }
            }
        }

    } else {
        if (Game.millisecs - this.collisionTime > Ball.period) {
            Game.collidedBalls[this.collisionArrayIndex] = false;
            Game.collidedBallsCount--;
            this.isAlive = false;
        }
        this.alpha = Ball.alpha - ((Game.millisecs - this.collisionTime)/Ball.period)*Ball.alpha;
    }

};

/**
 *
 */
Ball.prototype.checkWallCollision = function() {

    if (this.x <= 0 + this.size || this.x + this.size >= Game.canvas.width) {
        if (this.oldDirection == 0) {
            this.oldDirection = this.direction;
            this.direction = 180-this.direction;
            this.directionX *= -1;
        }
    }

    if (this.y <= 0 + this.size || this.y + this.size >= Game.canvas.height) {
        if (this.oldDirection == 0) {
            this.oldDirection = this.direction;
            this.direction = -this.direction;
            this.directionY *= -1;
        }
    }

    if (
        this.x > 0 + this.size*2 && this.x + this.size*2 < Game.canvas.width &&
        this.y > 0 + this.size*2 && this.y + this.size*2 < Game.canvas.height
    )
    {
        this.oldDirection = 0;
    }

};

/**
 *
 * @param ball
 * @returns {boolean}
 */
Ball.prototype.overlaps = function (ball) {
    return Collision.circlesOverlap(this.x, this.y, ball.x, ball.y, ball.sizePow2);
};

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////