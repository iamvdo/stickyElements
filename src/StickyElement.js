import animate from './animate';

export default class StickyElement {

  constructor (el, opts = {}) {
    this.el = el;
    this.setOpts(opts);
    this.setEvents();
  }

  setOpts (opts) {
    this.pointer = opts.pointer;
    this.positions = {};
    this.isGripped = false;
    this.stickiness = {};
    this.grip = {x: 3, y: 4};
    this.duration = opts.duration || 450;
    this.setStickiness(opts);
  }

  setEvents () {
    let el = this.el;
    const events = ['enter', 'leave', 'move'];
    // prevent events to be registered multiple times
    if (el._stickyEvents) {
      events.map(e => {
        if (this.pointer) {
          el.removeEventListener('pointer' + e, el._stickyEvents[e], false);
        } else {
          el.removeEventListener('mouse' + e, el._stickyEvents[e], false);
        }
      });
      el._stickyEvents = undefined;
    }
    el._stickyEvents = {
      enter: (e) => this.onEnter(e),
      leave: (e) => this.onLeave(e),
      move:  (e) => this.onMove(e)
    };
    
    events.map(e => {
      if (this.pointer) {
        el.addEventListener('pointer' + e, el._stickyEvents[e], false);
      } else {
        el.addEventListener('mouse' + e, el._stickyEvents[e], false);
      }
    });
  }

  setStickiness (opts) {
    const forces = {
      1: 10.0,
      2:  6.6,
      3:  4.5,
      4:  3.2,
      5:  2.4,
      6:  1.9,
      7:  1.6,
      8:  1.4,
      9:  1.3,
      10: 1.2,
      0:  0.0
    };
    let opt = {stickiness: {x: 3, y: 3}};
    // if no options specified
    if (opts.stickiness || opts.stickiness === 0) {
      if (typeof opts.stickiness === "number") {
        opt.stickiness = {x: opts.stickiness, y: opts.stickiness};
      }
      if (opts.stickiness.x || opts.stickiness.x === 0) {
        opt.stickiness.x = opts.stickiness.x;
      }
      if (opts.stickiness.y || opts.stickiness.y === 0) {
        opt.stickiness.y = opts.stickiness.y;
      }
    }
    this.stickiness.x = forces[Math.min(10, opt.stickiness.x)];
    this.stickiness.y = forces[Math.min(10, opt.stickiness.y)];
  }

  getPositions () {
    const posx = (this.stickiness.x !== 0) ? this.positions.deltax / this.stickiness.x : 0;
    const posy = (this.stickiness.y !== 0) ? this.positions.deltay / this.stickiness.y : 0;
    return {posx, posy};
  }

  onEnter (event) {
    this.state = 'ENTER';
    const element = this.el;
    const {offsetWidth, offsetHeight, offsetLeft, offsetTop} = element;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const positions = {
      width: offsetWidth,
      height: offsetHeight,
      centerx: offsetLeft + (offsetWidth / 2),
      centery: offsetTop + (offsetHeight / 2) - scrollTop
    };
    this.positions = positions;
    this.isGripped = false;
  }

  onLeave (event) {
    if (this.state === 'MOVE') {
      this.state = 'LEAVE';
      const element = this.el;
      //const {x, y} = this.getTranslate(element);
      const {x, y} = element._stickyTransforms;
      animate.stop(element);
      animate({
        el: element,
        translateX: [x, 0],
        translateY: [y, 0],
        duration: this.duration,
        each: (progress) => {
          element._stickyTransforms = {x: progress[0], y: progress[1]};
        }
      });
      this.isGripped = false;
    }
  }

  onMove (event) {
    this.state = 'MOVE';
    const element = this.el;
    animate.stop(element);

    const {clientX, clientY} = event;
    const isGrip = {
      x: Math.abs(this.positions.deltax) < (this.positions.width /  this.grip.x),
      y: Math.abs(this.positions.deltay) < (this.positions.height / this.grip.y)
    };
    if (isGrip.x && isGrip.y) {
      this.isGripped = true;
    }
    this.positions.deltax = -(this.positions.centerx - clientX);
    this.positions.deltay = -(this.positions.centery - clientY);

    if (this.isGripped) {
      const {posx, posy} = this.getPositions();
      element._stickyTransforms = {x: posx, y: posy};
      element.style.transform = 'translate3d(' + posx + 'px, ' + posy + 'px, 0)';
    }
  }

  getTranslate (elem) {
    const val = getComputedStyle(elem).transform;
    const matrix = this.parseMatrix(val);
    return {
      x: matrix.m41,
      y: matrix.m42,
      z: matrix.m43
    };
  }

  parseMatrix (matrixString) {
    const c = matrixString.split(/\s*[(),]\s*/).slice(1,-1);
    let matrix;

    if (c.length === 6) {
        // 'matrix()' (3x2)
        matrix = {
            m11: +c[0], m21: +c[2], m31: 0, m41: +c[4],
            m12: +c[1], m22: +c[3], m32: 0, m42: +c[5],
            m13: 0,     m23: 0,     m33: 1, m43: 0,
            m14: 0,     m24: 0,     m34: 0, m44: 1
        };
    } else if (c.length === 16) {
        // matrix3d() (4x4)
        matrix = {
            m11: +c[0], m21: +c[4], m31: +c[8],  m41: +c[12],
            m12: +c[1], m22: +c[5], m32: +c[9],  m42: +c[13],
            m13: +c[2], m23: +c[6], m33: +c[10], m43: +c[14],
            m14: +c[3], m24: +c[7], m34: +c[11], m44: +c[15]
        };
    } else {
        // handle 'none' or invalid values.
        matrix = {
            m11: 1, m21: 0, m31: 0, m41: 0,
            m12: 0, m22: 1, m32: 0, m42: 0,
            m13: 0, m23: 0, m33: 1, m43: 0,
            m14: 0, m24: 0, m34: 0, m44: 1
        };
    }
    return matrix;
  }
}