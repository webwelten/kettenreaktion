/*jslint bitwise: true, browser: true, eqeqeq: true, immed: true, newcap: true, nomen: true, plusplus: true, regexp: true, undef: true*/
/*global window */

var MouseHandler = {};

MouseHandler = function (element) {
  this.x = null;
  this.y = null;
  this.element = element;
  this.mousedown = false;
  this.mousehit = false;
  this.mousehit_time = null;

  var self = this;

  this.element.onmousemove = function (e) {
    self.getCoordinates(e);

  };

  this.element.onmousedown = function() {
    self.mousedown = true;

  };

  this.element.onmouseup = function() {
    self.mousedown = false;
    self.mousehit = false;

    self.mousehit_time = null;
  };
  
  this.element.touchend = function() {
    self.mousedown = false;
    self.mousehit = false;

    self.mousehit_time = null;
  };

  this.update = function () {

    if (this.mousedown) {
      if (this.mousehit_time === null) {
        this.mousehit_time = "test";
        this.mousehit = true;
      } else {
        this.mousehit = false;
      }
    }


  }

};

MouseHandler.prototype.getCoordinates = function (e) {

//  var e = this.e;
  // Mauskoordinaten herausbekommen
  var event;
  if (!e){
    event = window.event;
  } else {
    event = e;
  }
  if (event.pageX || event.pageY) {
    this.x = event.pageX;
    this.y = event.pageY;
  } else if (event.clientX || event.clientY) {
    this.x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    this.y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }

  this.x = this.x - this.element.offsetLeft - this.element.offsetParent.offsetLeft;
  this.y = this.y - this.element.offsetTop - this.element.offsetParent.offsetTop;

};