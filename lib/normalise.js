'use strict';

var ou = require('./objectUtils');

var alternative = require('./alternative');
var resolve = require('./resolve');


module.exports = function(data, schema, context) {
  return ou.prune(withDefaultOptions(data, schema, context));
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
    result = ou.merge(data);
    for (key in effectiveSchema.properties) {
      result[key] = withDefaultOptions((data || {})[key],
                                       effectiveSchema.properties[key],
                                       context);
    }
  } else if (effectiveSchema.type === 'array') {
    result = [];
    for (key = 0; key < (data || []).length; ++key) {
      result[key] = withDefaultOptions((data || [])[key],
                                       effectiveSchema.items,
                                       context);
    }
  } else {
    result = data;
  }
  return result;
}
