'use strict';

var ou = require('plexus-objective');


exports.schema = function(value, schema) {
  var selector, options, selected;

  selector = ou.getIn(schema, ['x-hints', 'form', 'selector']);
  if (!selector) {
    return;
  }

  options = schema.oneOf.map(function(alt) {
    return ou.getIn(alt, [ 'properties', selector, 'enum', 0 ]) || "";
  });

  selected = (value || {})[selector] || options[0];

  return ou.merge(ou.setIn(schema.oneOf[options.indexOf(selected)],
                           [ 'properties', selector ],
                           ou.merge(ou.getIn(schema, [ 'properties', selector]),
                                    { enum: options })),
                  { type: 'object' });
};
