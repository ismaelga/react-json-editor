'use strict';

var React = require('react');

var ou = require('../objectUtils');

var resolve = require('../resolve');
var types = require('../types');
var wrapped = require('./utils/wrapped');


module.exports = function(fields, props) {
  var schema = resolve(props.schema, props.context);
  var hints = schema['x-hints'] || {};
  var inputComponent = ou.getIn(hints, ['form', 'inputComponent']);
  var key = makeKey(props.path);

  props = ou.merge(props, {
    schema: schema,
    key   : key,
    label : key,
    value : props.getValue(props.path),
    errors: props.getErrors(props.path),
    type  : schema.type
  });

  if (inputComponent) {
    props = ou.merge(props, { component: props.handlers[inputComponent] });
    return wrapped.field(props, React.createElement(fields.UserDefinedField, props));
  } else if (hints.fileUpload) {
    console.warn("DEPRECATION WARNING: built-in file upload will be removed");
    // FileField cannot depend on fields directly (cyclic dependency)
    props = ou.merge(props, { fields: fields });
    return React.createElement(
      fields.FileField, ou.merge(props, { mode: hints.fileUpload.mode }));
  }
  else if (schema['oneOf']) {
    return wrapped.section(props, types.alternative(fields, props));
  }
  else if (schema['enum']) {
    props = ou.merge(props, {
        values: schema['enum'],
        names: schema['enumNames'] || schema['enum'] });
    return wrapped.field(props, React.createElement(fields.Selection, props));
  }

  switch (schema.type) {
  case "boolean":
    return wrapped.field(props, React.createElement(fields.CheckBox, props));
  case "object" :
    return wrapped.section(props, types.object(fields, props));
  case "array"  :
    return wrapped.section(props, types.array(fields, props));
  case "number" :
  case "integer":
  case "string" :
  default:
    return wrapped.field(props, React.createElement(fields.InputField, props));
  }
};

function makeKey(path) {
  return path.join('_');
}
