// sticky inputs[range]
stickyElements('[type=range]', {stickiness: {x: 1, y: 5}});

var inputs = [].slice.call(document.querySelectorAll('[type=range]'));
inputs.forEach(function (input) {
  updateTrack(input);
  updateOptions();
  input.addEventListener('input', updateTrack.bind(this, input), false);
  input.addEventListener('change', updateOptions.bind(this, input), false);
});

function updateOptions (input) {
  if (input) {
    hintButton('.button--primary');
  }
  var inputX = Math.ceil(document.getElementById('inputX').value);
  var inputY = Math.ceil(document.getElementById('inputY').value);
  var inputDuration = document.getElementById('inputDuration').value;
  var opts = {
    stickiness: {
      x: inputX,
      y: inputY
    },
    duration: inputDuration
  };
  if ('ontouchstart' in window) {
    opts.pointer = true;
  }
  stickyElements('.button, a, h1 span', opts);
}

function updateTrack (input) {
  var id = input.id;
  var value = 100 - (input.value*100/input.getAttribute('max'));
  var factor = Number(((1 - (value / 100)) * 2) - 1).toFixed(2);
  var val = 'calc(' + value + '% + (' + factor + ' * (1.25em / 2))) 100%, 100% 100%';

  var style = document.getElementById('style'+id);
  if (!style) {
    style = document.createElement('style');
    style.id = 'style' + id;
    document.body.appendChild(style);
  }
  style.textContent = 
    'input[type=range][id='+id+']::-webkit-slider-runnable-track{background-size:' + val + '}' + 
    'input[type=range][id='+id+']::-moz-range-track{background-size:' + val + '}';
}

//var animate = require('animateplus');

function hintButton (el) {
  animate({
    el: el,
    scale: 1.15,
    duration: 120,
    easing: 'easeOutCubic',
    complete: function () {
      animate({
        el: el,
        scale: [1.15, 1],
        duration: 500
      });
    }
  });
}
