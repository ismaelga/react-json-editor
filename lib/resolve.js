'use strict';

var ou = require('./objectUtils');


module.exports = function(schema, context) {
  var reference = schema['$ref'];

  if (reference) {
    if (!reference.match(/^#(\/([a-zA-Z_][a-zA-Z_0-9]*|[0-9]+))*$/)) {
      throw new Error('reference '+reference+' has unsupported format');
    }

    return ou.merge(
      ou.getIn(context, reference.split('/').slice(1)),
      without(schema, '$ref'));
  }
  else {
    return schema;
  }
};

function without(obj) {
  var args = [].slice.call(arguments);
  var result = Array.isArray(obj) ? [] : {};

  for (var key in obj) {
    if (args.indexOf(key) < 0) {
      result[key] = obj[key];
    }
  }

  return result;
}
