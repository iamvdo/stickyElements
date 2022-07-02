# Sticky Elements

Everything can stick. Just because.

[Demo](http://design.iamvdo.me/stickyElements)

## Getting started

`npm install stickyelements` and insert `dist/stickyelements-animate.js` (or build your own bundle using `src` files) like so:

```javascript
import animate from "stickyelements/dist/stickyelements-animate.js";
import stickyElements from "stickyelements/src/stickyElements.js";

window.animate = animate
stickyElements(".stick", {
  stickiness: 3,
  duration: 450,
});
```

If you're not using npm and just including the `stickyelements-animate.js` by itself as it's own script you can just stick:
```javascript
stickyElements('.item', {
  stickiness: 5,
  duration: 450
});


```
## Arguments

### CSS selector

* Elements that will stick to your mouse

### Options

* `stickiness` [Integer, Object]: How long elements remain stick to your mouse. If integer, apply same `x` and `y` values. If object, can contain `x` and/or `y` key. Integer between 0 and 10. (Default: `3`)
* `duration` [Integer]: Duration in milliseconds of animation (using [animateplus](https://github.com/bendc/animateplus). (Default: `450`)
* `pointer` [Boolean]: Enable Pointer Events instead of Mouse Events. Elements will stick to mouse, touch and all input types (Default: `false`). Need [PEP polyfill](https://github.com/jquery/PEP) and `touch-action` attribute on each elements (follow PEP polyfill instructions).
