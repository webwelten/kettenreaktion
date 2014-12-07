
var Score = {};

/**
 *
 * @param pts
 * @returns {number}
 */
Score.getScore = function (pts) {

    var score = Math.ceil((Game.level * 50 * pts) * 0.01);

    if ((Game.ballsCount - Game.reactions) < 15) {
        score += (15 - (Game.ballsCount - Game.reactions)) * 10;
    }

    return score;
};