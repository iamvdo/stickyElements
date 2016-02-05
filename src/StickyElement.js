export default class StickyElement {

  constructor (el, opts = {}) {
    this.el = el;
    this.setOpts(opts);
    // prevent events to be registered multiple times
    if (el._stickyEvents) {
      el.removeEventListener('mouseenter', el._stickyEvents.mouseEnter, false);
      el.removeEventListener('mouseleave', el._stickyEvents.mouseLeave, false);
      el.removeEventListener('mousemove',  el._stickyEvents.mouseMove, false);
      el._stickyEvents = undefined;
    }
    el._stickyEvents = {
      mouseEnter: ( ) => this.onMouseEnter(),
      mouseLeave: ( ) => this.onMouseLeave(),
      mouseMove:  (e) => this.onMouseMove(e)
    }
    el.addEventListener('mouseenter', el._stickyEvents.mouseEnter, false);
    el.addEventListener('mouseleave', el._stickyEvents.mouseLeave, false);
    el.addEventListener('mousemove',  el._stickyEvents.mouseMove, false);
  }

  setOpts (opts) {
    this.positions = {};
    this.isGripped = false;
    this.stickiness = {};
    this.grip = {x: 4, y: 4};
    this.duration = opts.duration || 450;
    this.setStickiness(opts);
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

  getPositions (deltax, deltay) {
    const posx = (this.stickiness.x !== 0) ? deltax / this.stickiness.x : 0;
    const posy = (this.stickiness.y !== 0) ? deltay / this.stickiness.y : 0;
    return {posx, posy};
  }

  onMouseEnter () {
    const {offsetWidth, offsetHeight, offsetLeft, offsetTop} = this.el;
    const positions = {
      width: offsetWidth,
      height: offsetHeight,
      centerx: offsetLeft + (offsetWidth / 2),
      centery: offsetTop + (offsetHeight / 2) - document.documentElement.scrollTop
    };
    this.positions = positions;
  }

  onMouseLeave () {
    // prevent mouseleave event to be triggered twice by 30ms
    if (this.lastGripped) {
      const now = new Date().getTime();
      if (now - this.lastGripped < 30) {
        return;
      }
    }
    const element = this.el;
    animate.stop(element);

    const {posx, posy} = this.getPositions(this.positions.deltax, this.positions.deltay);

    if (this.isGripped) {
      this.lastGripped = new Date().getTime();
      animate({
        el: element,
        translateX: [posx, 0],
        translateY: [posy, 0],
        duration: this.duration
      });
    }
    this.isGripped = false;
  }

  onMouseMove (event) {
    const element = this.el;
    animate.stop(element);

    this.positions.deltax = -(this.positions.centerx - event.clientX);
    this.positions.deltay = -(this.positions.centery - event.clientY);

    const isGrip = {
      x: Math.abs(this.positions.deltax) < (this.positions.width /  this.grip.x),
      y: Math.abs(this.positions.deltay) < (this.positions.height / this.grip.y)
    };

    if (isGrip.x && isGrip.y) {
      this.isGripped = true;
    }

    if (this.isGripped) {
      const {posx, posy} = this.getPositions(this.positions.deltax, this.positions.deltay);
      element.style.transform = 'translate3d(' + posx + 'px, ' + posy + 'px, 0)';
    }
  }
}