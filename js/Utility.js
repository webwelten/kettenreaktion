
// requestAnim shim layer by Paul Irish
// thanks to http://paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function()
{
    return  window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(/* function */ callback, /* DOMElement */ element)
    {
        window.setTimeout(callback, 1000 / 60); // 16 ms = ~60 fps
    };
})();