/*
 * StickyElements v1.0.0
 * http://github.com/iamvdo/stickyElements
 *
 * Copyright (c) Vincent De Oliveira
 * Released under the MIT license
 */

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var stickyElements = function () {

  "use strict";

  var forces = {
    1: 10.0,
    2: 6.6,
    3: 4.5,
    4: 3.2,
    5: 2.4,
    6: 1.9,
    7: 1.6,
    8: 1.4,
    9: 1.3,
    10: 1.2,
    0: 0.0
  };

  var StickyElement = function () {
    function StickyElement(el) {
      var _this = this;

      var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      _classCallCheck(this, StickyElement);

      this.el = el;
      el.addEventListener('mouseenter', function () {
        return _this.onMouseEnter();
      }, false);
      el.addEventListener('mouseleave', function () {
        return _this.onMouseLeave();
      }, false);
      el.addEventListener('mousemove', function (e) {
        return _this.onMouseMove(e);
      }, false);
      this.setOpts(opts);
    }

    _createClass(StickyElement, [{
      key: 'setOpts',
      value: function setOpts(opts) {
        this.positions = {};
        this.isGripped = false;
        this.stickiness = { x: 3, y: 3 };
        this.grip = { x: 4, y: 4 };
        this.setStickiness(opts);
      }
    }, {
      key: 'setStickiness',
      value: function setStickiness(opts) {
        if (typeof opts.stickiness === "number") {
          opts.stickiness = { x: opts.stickiness, y: opts.stickiness };
        }
        if (!opts.stickiness) {
          opts.stickiness = this.stickiness;
        };
        if (opts.stickiness && !opts.stickiness.x && opts.stickiness.x !== 0) {
          opts.stickiness.x = this.stickiness.x;
        };
        if (opts.stickiness && !opts.stickiness.y && opts.stickiness.y !== 0) {
          opts.stickiness.y = this.stickiness.y;
        };
        this.stickiness.x = forces[Math.min(10, opts.stickiness.x)];
        this.stickiness.y = forces[Math.min(10, opts.stickiness.y)];
      }
    }, {
      key: 'getPositions',
      value: function getPositions(deltax, deltay) {
        var posx = isFinite(deltax / this.stickiness.x) ? deltax / this.stickiness.x : 0;
        var posy = isFinite(deltay / this.stickiness.y) ? deltay / this.stickiness.y : 0;
        return { x: posx, y: posy };
      }
    }, {
      key: 'onMouseEnter',
      value: function onMouseEnter() {
        var button = this.el;
        this.positions = {
          centerx: button.offsetLeft + button.offsetWidth / 2,
          centery: button.offsetTop + button.offsetHeight / 2 - document.documentElement.scrollTop
        };
      }
    }, {
      key: 'onMouseLeave',
      value: function onMouseLeave() {
        var button = this.el;
        animate.stop(button);

        var pos = this.getPositions(this.positions.deltax, this.positions.deltay);

        if (this.isGripped) {
          animate({
            el: button,
            translateX: [pos.x, 0],
            translateY: [pos.y, 0],
            duration: 450
          });
          button.style.position = 'static';
          button.style.zIndex = 'auto';
        }
        this.isGripped = false;
      }
    }, {
      key: 'onMouseMove',
      value: function onMouseMove(event) {
        var button = this.el;
        animate.stop(button);

        this.positions.deltax = -(this.positions.centerx - event.clientX);
        this.positions.deltay = -(this.positions.centery - event.clientY);

        var isGrip = {
          x: Math.abs(this.positions.deltax) < button.offsetWidth / this.grip.x,
          y: Math.abs(this.positions.deltay) < button.offsetHeight / this.grip.y
        };

        if (isGrip.x && isGrip.y) {
          this.isGripped = true;
        };

        if (this.isGripped) {
          var pos = this.getPositions(this.positions.deltax, this.positions.deltay);
          button.style.transform = 'translate(' + pos.x + 'px, ' + pos.y + 'px)';
          button.style.position = 'relative';
          button.style.zIndex = 1;
        }
      }
    }]);

    return StickyElement;
  }();

  return function (selector, opts) {
    var stickyElementsTab = [];
    var buttons = [].slice.call(document.querySelectorAll(selector));
    for (var i = 0; i < buttons.length; i++) {
      stickyElementsTab.push(new StickyElement(buttons[i], opts));
    };
    return stickyElementsTab;
  };
}();

if (typeof module != "undefined" && module.exports) {
  module.exports = stickyElements;
}