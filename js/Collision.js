var CollisionBox = {
    x1 : 0,
    y1 : 0,
    x2 : 0,
    y2 : 0,
    draw : function() {
        Game.ctx.globalAlpha = '1';
        Game.ctx.strokeRect(this.x1, this.y1, this.x2 - this.x1, this.y2-this.y1);
    }
};

var Collision = {};

/**
 *
 * @param x1
 * @param y1
 * @param width1
 * @param height1
 * @param x2
 * @param y2
 * @param width2
 * @param height2
 * @returns {boolean}
 */
Collision.rectsOverlap = function (x1, y1, width1, height1, x2, y2, width2, height2) {

    if ( (x1 + width1) > (x2)  && (x1) < (x2 + width2) ) {
      if ( (y1 + height1) > (y2)  && (y1) < (y2 + height2) ) {
        return true;
      }
    }
    return false;
};

/**
 *
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @param radiusPow2
 * @returns {boolean}
 */
Collision.circlesOverlap = function (x1, y1, x2, y2, radiusPow2) {

    var a, b, c, vector_x, vector_y;

    a = (x1-x2);
    b = (y1-y2);
    c = Math.sqrt( (Math.pow(a,2) + Math.pow(b,2)) );

    vector_x = (a/c);
    vector_y = (b/c);

    var calc = (Math.pow(x1 - vector_x*10 - x2, 2) + Math.pow(y1 - vector_y*10 - y2, 2) );
    if ( calc >= 0 && calc <= radiusPow2 ) {
      return true;
    }

};
