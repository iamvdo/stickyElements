var fs = require('fs');
var babel  = require('rollup-plugin-babel');
var rollup = require('rollup');
var uglify = require('uglify-js');


var args = process.argv;
var packageFile = JSON.parse(fs.readFileSync('package.json', 'utf8'));
var version = packageFile.version;

var files = {
  src:         './src/stickyElements.js',
  srcAnimate:  './node_modules/animateplus/animate.min.js',
  dist:        './dist/stickyelements.js',
  distAnimate: './dist/stickyelements-animate.js'
}

function minify (code) {
  return uglify.minify(code, {fromString: true}).code;
}

function runBuild () {
  fs.mkdir('./dist', (err) => {
    rollup.rollup({
      entry: files.src,
      plugins: [ babel({presets: [ 'es2015-rollup' ]}) ]
    }).then(function (bundle) {
      var result = bundle.generate({
        format: 'iife',
        moduleName: 'stickyElements'
      });
      var code = minify(result.code);
      fs.writeFile(files.dist, code, 'utf8');
      fs.readFile(files.srcAnimate, 'utf8', (err, animate) => {
        fs.writeFile(files.distAnimate, animate + code, 'utf8');
      });
    }).then(function () {
      console.log('[', new Date().toGMTString(), ']', 'Builded');
    }, function (err) {
      console.log(err);
    });
  });
}

runBuild();

if (args[2] && args[2] === '-w') {
  fs.watchFile(files.src, runBuild);
  fs.watchFile('./src/animate.js', runBuild);
  fs.watchFile('./src/StickyElement.js', runBuild);
}
