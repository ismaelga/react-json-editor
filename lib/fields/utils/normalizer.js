'use strict';


exports.string = function(text) {
  return text
    .replace(/\s+/g, ' ')
    .replace(/^ /, '')
    .replace(/\u00ad/g, '');
};

exports.integer = function(text) {
  return text
    .replace(/[^-\d]/g, '')
    .replace(/(.)-/g, '$1');
};

exports.number = function(text) {
  return text
    .replace(/[^-\.e\d]/ig, '')
    .replace(/(e[^e]*)e/ig, '$1')
    .replace(/([e.][^.]*)\./ig, '$1')
    .replace(/([^e])-/ig, '$1')
    .replace(/(e-?\d\d\d)\d/ig, '$1');
};
