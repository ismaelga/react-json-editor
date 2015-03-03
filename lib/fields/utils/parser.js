'use strict';

var normalizer = require('./normalizer');


exports.string = function(text) {
  return normalizer.string(text);
};

exports.integer = function(text) {
  return text ? parseInt(normalizer.integer(text)) : null;
};

exports.number = function(text) {
  return text ? parseFloat(normalizer.number(text)) : null;
};
