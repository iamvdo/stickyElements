# Sticky Elements

Everything can stick. Just because.

[Demo](http://design.iamvdo.me/stickyElements)

## Getting started

`npm install stickyelements` and insert `dist/stickyelements-animate.js` (or build your own bundle using `src` files)

Then, stick elements!

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
