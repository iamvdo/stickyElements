// sticky title
stickyElements('h1 span');
// sticky links
stickyElements('a', {stickiness: {x: 2, y: 5}});
// sticky inputs[range]
stickyElements('[type=range]', {stickiness: {x: 1, y: 5}});

var inputs = [].slice.call(document.querySelectorAll('[type=range]'));
inputs.forEach(function (input) {
  updateTrack(input);
  updateStickiness();
  input.addEventListener('input', updateTrack.bind(this, input), false);
  input.addEventListener('change', updateStickiness.bind(this, input), false);
});

function updateStickiness (input) {
  if (input) {
    hintButton('.button--primary');
  }
  var inputX = Math.ceil(document.getElementById('inputX').value);
  var inputY = Math.ceil(document.getElementById('inputY').value);
  stickyElements('.button', {
    stickiness: {
      x: inputX,
      y: inputY
    }
  });
}

function updateTrack (input) {
  var id = input.id;
  var value = 100 - (input.value*10);
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
