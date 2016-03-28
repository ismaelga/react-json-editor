'use strict';

var ou = require('./objectUtils');

var alternative = require('./alternative');
var resolve = require('./resolve');


module.exports = function(data, schema, context) {
  return ou.prune(withDefaultOptions(data, schema, context)).value;
};

function withDefaultOptions(data, schema, context) {
  var result;
  var key;
  var effectiveSchema = resolve(schema, context);

  if (effectiveSchema.oneOf) {
    effectiveSchema = alternative.schema(data, effectiveSchema, context);
  }

  if (effectiveSchema['enum']) {
    result = data || effectiveSchema['enum'][0];
  } else if (effectiveSchema.type === 'object') {
    var property;
    result = data;
    for (key in effectiveSchema.properties) {
      property = (data || {})[key];
      if (property) {
        result[key] = withDefaultOptions(property, effectiveSchema.properties[key], context);
      }
    }
  } else if (effectiveSchema.type === 'array') {
    var item;
    var arrayLength = (data || []).length;
    result = arrayLength > 0 ? [] : data;
    for (key = 0; key < arrayLength; ++key) {
      item = (data || [])[key];
      if (item) {
        result[key] = withDefaultOptions(item, effectiveSchema.items, context);
      }
    }
  } else {
    result = data;
  }
  return result;
}
