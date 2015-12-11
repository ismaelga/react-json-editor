'use strict';

var ou = require('./objectUtils');

var alternative = require('./alternative');


var types = {
  alternative: function(fields, props) {
    var s = alternative.schema(props.getValue(props.path), props.schema, props.context);

    return types.object(fields, ou.merge(props, { schema: s }));
  },
  array: function(fields, props) {
    var n = (props.getValue(props.path) || []).length + 1;
    var list = [];
    for (var i = 0; i < n; ++i) {
      list.push(fields.make(fields, ou.merge(props, {
        schema: props.schema.items,
        path  : props.path.concat(i),
      })));
    }
    return list;
  },
  object: function(fields, props) {
    var keys = fullOrdering(props.schema['x-ordering'], props.schema.properties);
    return keys.map(function(key) {
      return fields.make(fields, ou.merge(props, {
        schema: props.schema.properties[key],
        path  : props.path.concat(key)
      }));
    });
  },
};

module.exports = types;

function fullOrdering(list, obj) {
  var keys = Object.keys(obj || {});
  var result = [];
  var k, key;

  if(Array.isArray(list)) {
    for (var i = 0; i < list.length; i++) {
      key = list[i];
      if (keys.indexOf(key) >= 0) {
        result.push(key);
      }
    }
  }

  for (k in keys) {
    if(!keys.hasOwnProperty(k))
      continue;
    key = keys[k];
    if (result.indexOf(key) < 0) {
      result.push(key);
    }
  }

  return result;
}
