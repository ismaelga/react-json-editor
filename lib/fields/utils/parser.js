'use strict';

var normalizer = require('./normalizer');
var ou = require('../../objectUtils');

exports.string = function(text) {
  return normalizer.string(text);
};

exports.integer = function(text) {
  return ou.isNil(text) ? null : parseInt(normalizer.integer(text));
};

exports.number = function(text) {
  return ou.isNil(text) ? null : parseFloat(normalizer.number(text));
};
