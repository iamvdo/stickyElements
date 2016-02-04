var fs = require('fs');
var babel  = require('rollup-plugin-babel');
var rollup = require('rollup');
var uglify = require('uglify-js');


var args = process.argv;
var packageFile = JSON.parse(fs.readFileSync('package.json', 'utf8'));
var version = packageFile.version;

var files = {
  src:            './src/stickyElements.js',
  srcAnimate:     './node_modules/animateplus/animate.js',
  srcAnimateMin:  './node_modules/animateplus/animate.min.js',
  dist:           './dist/stickyElements.js',
  distMin:        './dist/stickyElements.min.js',
  distAnimateMin: './dist/stickyElements-animate.min.js'
}

function minify (code) {
  return uglify.minify(code, {fromString: true}).code;
}

function addComment (code) {
  return `/*
 * StickyElements v${version}
 * http://github.com/iamvdo/stickyElements
 *
 * Copyright (c) Vincent De Oliveira
 * Released under the MIT license
 */

` + code;
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
      fs.writeFile(files.dist, addComment(result.code), 'utf8');
      fs.writeFile(files.distMin, minify(result.code), 'utf8');
      fs.readFile(files.srcAnimateMin, 'utf8', (err, animate) => {
        fs.writeFile(files.distAnimateMin, minify(animate + result.code), 'utf8');
      });
    }, function (err) {
      console.log(err);
    });
  });
}

runBuild();


