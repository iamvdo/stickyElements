/*
 * StickyElements v1.0.0
 * http://github.com/iamvdo/stickyElements
 *
 * Copyright (c) Vincent De Oliveira
 * Released under the MIT license
 */

var stickyElements = (function () {
  'use strict';

  var babelHelpers = {};

  babelHelpers.classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  babelHelpers.createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  babelHelpers;

  var StickyElement = function () {
    function StickyElement(el) {
      var _this = this;

      var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      babelHelpers.classCallCheck(this, StickyElement);

      this.el = el;
      this.setOpts(opts);
      // prevent events to be registered multiple times
      if (el._stickyEvents) {
        el.removeEventListener('mouseenter', el._stickyEvents.mouseEnter, false);
        el.removeEventListener('mouseleave', el._stickyEvents.mouseLeave, false);
        el.removeEventListener('mousemove', el._stickyEvents.mouseMove, false);
        el._stickyEvents = undefined;
      }
      el._stickyEvents = {
        mouseEnter: function mouseEnter() {
          return _this.onMouseEnter();
        },
        mouseLeave: function mouseLeave() {
          return _this.onMouseLeave();
        },
        mouseMove: function mouseMove(e) {
          return _this.onMouseMove(e);
        }
      };
      el.addEventListener('mouseenter', el._stickyEvents.mouseEnter, false);
      el.addEventListener('mouseleave', el._stickyEvents.mouseLeave, false);
      el.addEventListener('mousemove', el._stickyEvents.mouseMove, false);
    }

    babelHelpers.createClass(StickyElement, [{
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
        var posx = this.stickiness.x !== 0 ? deltax / this.stickiness.x : 0;
        var posy = this.stickiness.y !== 0 ? deltay / this.stickiness.y : 0;
        return { posx: posx, posy: posy };
      }
    }, {
      key: 'onMouseEnter',
      value: function onMouseEnter() {
        var _el = this.el;
        var offsetWidth = _el.offsetWidth;
        var offsetHeight = _el.offsetHeight;
        var offsetLeft = _el.offsetLeft;
        var offsetTop = _el.offsetTop;

        var positions = {
          width: offsetWidth,
          height: offsetHeight,
          centerx: offsetLeft + offsetWidth / 2,
          centery: offsetTop + offsetHeight / 2 - document.documentElement.scrollTop
        };
        this.positions = positions;
      }
    }, {
      key: 'onMouseLeave',
      value: function onMouseLeave() {
        // prevent mouseleave event to be triggered twice by 30ms
        if (this.lastGripped) {
          var now = new Date().getTime();
          if (now - this.lastGripped < 30) {
            return;
          }
        }
        var element = this.el;
        animate.stop(element);

        var _getPositions = this.getPositions(this.positions.deltax, this.positions.deltay);

        var posx = _getPositions.posx;
        var posy = _getPositions.posy;

        if (this.isGripped) {
          this.lastGripped = new Date().getTime();
          animate({
            el: element,
            translateX: [posx, 0],
            translateY: [posy, 0],
            duration: 450
          });
        }
        this.isGripped = false;
      }
    }, {
      key: 'onMouseMove',
      value: function onMouseMove(event) {
        var element = this.el;
        animate.stop(element);

        this.positions.deltax = -(this.positions.centerx - event.clientX);
        this.positions.deltay = -(this.positions.centery - event.clientY);

        var isGrip = {
          x: Math.abs(this.positions.deltax) < this.positions.width / this.grip.x,
          y: Math.abs(this.positions.deltay) < this.positions.height / this.grip.y
        };

        if (isGrip.x && isGrip.y) {
          this.isGripped = true;
        }

        if (this.isGripped) {
          var _getPositions2 = this.getPositions(this.positions.deltax, this.positions.deltay);

          var posx = _getPositions2.posx;
          var posy = _getPositions2.posy;

          element.style.transform = 'translate3d(' + posx + 'px, ' + posy + 'px, 0)';
        }
      }
    }]);
    return StickyElement;
  }();

  var stickyElements = function () {
    return function (selector, opts) {
      var stickyElementsTab = [];
      var elements = [].slice.call(document.querySelectorAll(selector));
      for (var i = 0; i < elements.length; i++) {
        stickyElementsTab.push(new StickyElement(elements[i], opts));
      };
      return stickyElementsTab;
    };
  }();

  return stickyElements;

}());