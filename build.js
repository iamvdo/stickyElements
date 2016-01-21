var fs = require('fs');
var babel = require('babel-core');
var uglify = require("uglify-js");

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

fs.mkdir('./dist', function (err) {
  babel.transformFile(files.src, {presets: 'es2015'}, function (err, lib) {
    fs.writeFile(files.dist, addComment(lib.code), 'utf8');
    fs.writeFile(files.distMin, minify(lib.code), 'utf8');
    fs.readFile(files.srcAnimateMin, 'utf8', function (err, animate) {
      fs.writeFile(files.distAnimateMin, minify(animate + lib.code), 'utf8');
    });
  });
});



if (args[2] && args[2] === '--no-animate') {
  
}



