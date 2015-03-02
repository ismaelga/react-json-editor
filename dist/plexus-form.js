(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["PlexusForm"] = factory(require("react"));
	else
		root["PlexusForm"] = factory(root["react"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/*
	The MIT License (MIT)

	Copyright (c) 2014 The Australian National University

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
	*/

	'use strict';

	var React = __webpack_require__(1);

	var ou = __webpack_require__(2);

	var $ = React.DOM;


	var normalizer = {};


	normalizer.string = function(text) {
	  return text
	    .replace(/\s+/g, ' ')
	    .replace(/^ /, '')
	    .replace(/\u00ad/g, '');
	};

	normalizer.integer = function(text) {
	  return text
	    .replace(/[^-\d]/g, '')
	    .replace(/(.)-/g, '$1');
	};

	normalizer.number = function(text) {
	  return text
	    .replace(/[^-\.e\d]/ig, '')
	    .replace(/(e[^e]*)e/ig, '$1')
	    .replace(/([e.][^.]*)\./ig, '$1')
	    .replace(/([^e])-/ig, '$1')
	    .replace(/(e-?\d\d\d)\d/ig, '$1');
	};


	var parser = {};

	parser.string = function(text) {
	  return normalizer.string(text);
	};

	parser.integer = function(text) {
	  return text ? parseInt(normalizer.integer(text)) : null;
	};

	parser.number = function(text) {
	  return text ? parseFloat(normalizer.number(text)) : null;
	};


	var UserDefinedField = React.createClass({
	  displayName: 'UserDefinedField',

	  normalize: function(text) {
	    var n = normalizer[this.props.type];
	    return n ? n(text) : text;
	  },
	  parse: function(text) {
	    var p = parser[this.props.type];
	    return p ? p(text) : text;
	  },
	  handleChange: function(value) {
	    var text = this.normalize(value);
	    this.props.update(this.props.path, text, this.parse(text));
	  },
	  handleKeyPress: function(event) {
	    if (event.keyCode == 13)
	      event.preventDefault();
	  },
	  render: function() {
	    return React.createElement(this.props.component, {
	      value     : this.props.value || '',
	      onKeyPress: this.handleKeyPress,
	      onChange  : this.handleChange
	    });
	  }
	});


	var InputField = React.createClass({
	  displayName: 'InputField',

	  normalize: function(text) {
	    return normalizer[this.props.type](text);
	  },
	  parse: function(text) {
	    return parser[this.props.type](text);
	  },
	  handleChange: function(event) {
	    var text = this.normalize(event.target.value);
	    this.props.update(this.props.path, text, this.parse(text));
	  },
	  handleKeyPress: function(event) {
	    if (event.keyCode == 13)
	      event.preventDefault();
	  },
	  render: function() {
	    return $.input({
	      type      : "text",
	      name      : this.props.key,
	      value     : this.props.value || '',
	      onKeyPress: this.handleKeyPress,
	      onChange  : this.handleChange });
	  }
	});


	var CheckBox = React.createClass({
	  displayName: 'CheckBox',

	  handleChange: function(event) {
	    var val = event.target.checked;
	    this.props.update(this.props.path, val, val);
	  },
	  render: function() {
	    return $.input({
	      name: this.props.key,
	      type: "checkbox",
	      checked: this.props.value || false,
	      onChange: this.handleChange });
	  }
	});


	var Selection = React.createClass({
	  displayName: 'Selection',

	  normalize: function(text) {
	    return normalizer[this.props.type](text);
	  },
	  parse: function(text) {
	    return parser[this.props.type](text);
	  },
	  handleChange: function(event) {
	    var val = this.normalize(event.target.value);
	    this.props.update(this.props.path, val, this.parse(val));
	  },
	  render: function() {
	    var names = this.props.names;

	    return $.select(
	      {
	        name    : this.props.key,
	        value   : this.props.value || this.props.values[0],
	        onChange: this.handleChange
	      },
	      this.props.values.map(function(opt, i) {
	        return $.option({ key: opt, value: opt }, names[i] || opt);
	      }));
	  }
	});


	var FileField = React.createClass({
	  displayName: 'FileField',

	  loadFile: function(event) {
	    var reader = new FileReader();
	    var file = event.target.files[0];
	    var val = ou.merge(this.props.getValue(this.props.path), {
	      name: file.name,
	      type: file.type,
	      size: file.size
	    });

	    this.props.update(this.props.path, val, val);

	    reader.onload = function(event) {
	      val.data = event.target.result;
	      this.props.update(this.props.path, val, val);
	    }.bind(this);

	    if (file) {
	      if (this.props.mode == 'dataURL')
	        reader.readAsDataURL(file);
	      else
	        reader.readAsText(file);
	    }
	  },
	  render: function() {
	    var value = this.props.value || {};
	    var list = [
	      $.input({ key: "input", type: "file", onChange: this.loadFile }),
	      $.dl({ key: "fileProperties" },
	           $.dt(null, "Name"), $.dd(null, value.name || '-'),
	           $.dt(null, "Size"), $.dd(null, value.size || '-'),
	           $.dt(null, "Type"), $.dd(null, value.type || '-'))
	    ];

	    return wrappedSection(this.props, list.concat(fieldsForObject(this.props)));
	  }
	});


	var errorClass = function(errors) {
	  return (errors == null || errors.length == 0) ? '' : 'error';
	};


	var makeTitle = function(description, errors) {
	  var parts = [];
	  if (description != null && description.length > 0)
	    parts.push(description);
	  if (errors != null && errors.length > 0)
	    parts.push(errors.join('\n'));
	  return parts.join('\n\n');
	};


	var FieldWrapper = React.createClass({displayName: "FieldWrapper",
	  render: function() {
	    var classes = [].concat(errorClass(this.props.errors) || [],
	                            'form-element',
	                            this.props.classes || []);

	    return $.div(
	      {
	        className: classes.join(' '),
	        key      : this.props.key,
	        title    : makeTitle(this.props.description, this.props.errors)
	      },
	      $.label(
	        {
	          htmlFor: this.props.key
	        },
	        this.props.title),
	      this.props.children);
	  }
	});


	var SectionWrapper = React.createClass({displayName: "SectionWrapper",
	  render: function() {
	    var level = this.props.path.length;
	    var classes = [].concat('form-section',
	                            (level > 0 ? 'form-subsection' : []),
	                            this.props.classes || []);
	    var legendClasses = [].concat(errorClass(this.props.errors) || [],
	                                  'form-section-title');

	    return $.fieldset(
	      {
	        className: classes.join(' '),
	        key      : this.props.key
	      },
	      $.legend(
	        {
	          className: legendClasses.join(' '),
	          title    : makeTitle(this.props.description, this.props.errors)
	        },
	        this.props.title),
	      this.props.children);
	  }
	});


	var propsForWrapper = function(props) { 
	  return {
	    key        : props.key,
	    path       : props.path,
	    errors     : props.errors,
	    classes    : ou.getIn(props.schema, ['x-hints', 'form', 'classes']),
	    title      : props.schema.title,
	    description: props.schema.description
	  };
	}


	var wrappedField = function(props, field) {
	  return React.createElement(props.fieldWrapper || FieldWrapper,
	    propsForWrapper(props),
	    field);
	};


	var wrappedSection = function(props, fields) {
	  return React.createElement(props.sectionWrapper || SectionWrapper,
	    propsForWrapper(props),
	    fields);
	};


	var fullOrdering = function(list, obj) {
	  var keys = Object.keys(obj || {});
	  var result = [];
	  var i, k;

	  for (i in list || []) {
	    k = list[i];
	    if (keys.indexOf(k) >= 0)
	      result.push(k);
	  }

	  for (i in keys) {
	    k = keys[i];
	    if (result.indexOf(k) < 0)
	      result.push(k);
	  }

	  return result;
	};


	var fieldsForObject = function(props) {
	  var keys = fullOrdering(props.schema['x-ordering'], props.schema.properties);

	  return keys.map(function(key) {
	    return makeFields(ou.merge(props, {
	      schema: props.schema.properties[key],
	      path  : props.path.concat(key)
	    }));
	  });
	};


	var fieldsForArray = function(props) {
	  var n = (props.getValue(props.path) || []).length + 1;
	  var list = [];
	  for (var i = 0; i < n; ++i) {
	    list.push(makeFields(ou.merge(props, {
	      schema: props.schema.items,
	      path  : props.path.concat(i),
	    })));
	  }

	  return list;
	};


	var schemaForAlternative = function(value, schema) {
	  var selector, options, selected;

	  selector = ou.getIn(schema, ['x-hints', 'form', 'selector']);
	  if (!selector)
	    return;

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


	var fieldsForAlternative = function(props) {
	  var schema = schemaForAlternative(props.getValue(props.path), props.schema);

	  return fieldsForObject(ou.merge(props, { schema: schema }));
	};


	var makeKey = function(path) {
	  return path.join('_');
	};


	var without = function(obj) {
	  var args = [].slice.call(arguments);
	  var result = Array.isArray(obj) ? [] : {};

	  for (var key in obj)
	    if (args.indexOf(key) < 0)
	      result[key] = obj[key];

	  return result;
	};


	var resolve = function(schema, context) {
	  var reference = schema['$ref'];

	  if (reference) {
	    if (!reference.match(/^#(\/([a-zA-Z_][a-zA-Z_0-9]*|[0-9]+))*$/))
	      throw new Error('reference '+reference+' has unsupported format');

	    return ou.merge(
	      ou.getIn(context, reference.split('/').slice(1)),
	      without(schema, '$ref'));
	  } else
	    return schema;
	};


	var makeFields = function(props) {
	  var schema = resolve(props.schema, props.context);
	  var hints = schema['x-hints'] || {};
	  var inputComponent = ou.getIn(hints, ['form', 'inputComponent']);

	  props = ou.merge(props, {
	    schema: schema,
	    key   : makeKey(props.path),
	    value : props.getValue(props.path),
	    errors: props.getErrors(props.path),
	    type  : schema.type
	  });

	  if (inputComponent) {
	    props = ou.merge(props, { component: props.handlers[inputComponent] });
	    return wrappedField(props, React.createElement(UserDefinedField, props));
	  } else if (hints.fileUpload)
	    return React.createElement(
	      FileField, ou.merge(props, { mode: hints.fileUpload.mode }));
	  else if (schema['oneOf'])
	    return wrappedSection(props, fieldsForAlternative(props));
	  else if (schema['enum']) {
	    props = ou.merge(props, {
	        values: schema['enum'],
	        names: schema['enumNames'] || schema['enum'] });
	    return wrappedField(props, React.createElement(Selection, props));
	  }

	  switch (schema.type) {
	  case "boolean":
	    return wrappedField(props, React.createElement(CheckBox, props));
	  case "object" :
	    return wrappedSection(props, fieldsForObject(props));
	  case "array"  :
	    return wrappedSection(props, fieldsForArray(props));
	  case "number" :
	  case "integer":
	  case "string" :
	  default:
	    return wrappedField(props, React.createElement(InputField, props));
	  }
	};


	var withDefaultOptions = function(data, schema, context) {
	  var result;
	  var key;
	  var effectiveSchema = resolve(schema, context);

	  if (effectiveSchema.oneOf)
	    effectiveSchema = schemaForAlternative(data, effectiveSchema, context);

	  if (effectiveSchema['enum']) {
	    result = data || effectiveSchema['enum'][0];
	  } else if (effectiveSchema.type == 'object') {
	    result = ou.merge(data);
	    for (key in effectiveSchema.properties)
	      result[key] = withDefaultOptions((data || {})[key],
	                                       effectiveSchema.properties[key],
	                                       context);
	  } else if (effectiveSchema.type == 'array') {
	    result = [];
	    for (key = 0; key < (data || []).length; ++key)
	      result[key] = withDefaultOptions((data || [])[key],
	                                       effectiveSchema.items,
	                                       context);
	  } else {
	    result = data;
	  }
	  return result;
	};


	var hashedErrors = function(errors) {
	  var result = {};
	  var i, entry;
	  for (i = 0; i < errors.length; ++i) {
	    entry = errors[i];
	    result[makeKey(entry.path)] = entry.errors;
	  }
	  return result;
	};


	var normalise = function(data, schema, context) {
	  return ou.prune(withDefaultOptions(data, schema, context));
	};

	var context = function(props) {
	  return props.context || props.schema;
	};


	var Form = React.createClass({
	  displayName: 'Form',

	  getInitialState: function() {
	    var values = this.props.values;
	    var errors = this.validate(this.props.schema, values, context(this.props));
	    return { values: values,
	             output: values,
	             errors: errors };
	  },
	  componentWillReceiveProps: function(props) {
	    var values = props.values || this.state.values;
	    var output = props.values || this.state.output;
	    this.setState({
	      values: values,
	      output: output,
	      errors: this.validate(props.schema, output, context(props))
	    });
	  },
	  setValue: function(path, raw, parsed) {
	    var schema = this.props.schema;
	    var ctx    = context(this.props);
	    var values = normalise(ou.setIn(this.state.values, path, raw),
	                           schema, ctx);
	    var output = normalise(ou.setIn(this.state.output, path, parsed),
	                           schema, ctx);
	    var errors = this.validate(schema, output, ctx);

	    if (this.props.submitOnChange)
	      this.props.onSubmit(output, null, errors);
	    else
	      this.setState({
	        values: values,
	        output: output,
	        errors: errors
	      });
	  },
	  getValue: function(path) {
	    return ou.getIn(this.state.values, path);
	  },
	  getErrors: function(path) {
	    return this.state.errors[makeKey(path)];
	  },
	  validate: function(schema, values, context) {
	    return hashedErrors(this.props.validate(schema, values, context));
	  },
	  preventSubmit: function(event) {
	    event.preventDefault();
	  },
	  handleSubmit: function(event) {
	    this.props.onSubmit(this.state.output,
	                        event.target.value,
	                        this.state.errors);
	  },
	  handleKeyPress: function(event) {
	    if (event.keyCode == 13 && this.props.enterKeySubmits)
	      this.props.onSubmit(this.state.output, this.props.enterKeySubmits);
	  },
	  renderButtons: function() {
	    var submit = this.handleSubmit;

	    if (typeof this.props.buttons == 'function')
	      return this.props.buttons(submit);
	    else {
	      var buttons = (this.props.buttons || ['Cancel', 'Submit'])
	        .map(function(value) {
	          return $.input({ type   : 'submit',
	                           key    : value,
	                           value  : value,
	                           onClick: submit })
	        });
	      return $.p(null, buttons);
	    }
	  },
	  render: function() {
	    var schema = this.props.schema;
	    var fields = makeFields({
	      schema        : this.props.schema,
	      context       : context(this.props),
	      fieldWrapper  : this.props.fieldWrapper,
	      sectionWrapper: this.props.sectionWrapper,
	      handlers      : this.props.handlers,
	      hints         : this.props.hints,
	      path          : [],
	      update        : this.setValue,
	      getValue      : this.getValue,
	      getErrors     : this.getErrors
	    });

	    return $.form({ onSubmit  : this.preventSubmit,
	                    onKeyPress: this.handleKeyPress,
	                    className : this.props.className
	                  },
	                  this.props.extraButtons ? this.renderButtons() : $.span(),
	                  fields,
	                  this.renderButtons());
	  }
	});

	module.exports = Form;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/*
	The MIT License (MIT)

	Copyright (c) 2014 The Australian National University

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
	*/

	'use strict';

	var isNat = function(x) {
	  return typeof x == 'number' && x >= 0 && x % 1 == 0;
	};

	var object = function() {
	  var args = Array.prototype.slice.call(arguments);
	  var result = [];
	  var i;

	  for (i = 0; i+1 < args.length; i += 2)
	    if (!isNat(args[i]))
	      result = {};

	  for (i = 0; i+1 < args.length; i += 2)
	    result[args[i]] = args[i + 1];

	  return result;
	};


	var merge = function() {
	  var args = Array.prototype.slice.call(arguments);
	  var result = args.every(Array.isArray) ? [] : {};
	  var i, obj, key;
	  for (i in args) {
	    obj = args[i];
	    for (key in obj)
	      result[key] = obj[key];
	  }
	  return result;
	};


	var getIn = function(root, path) {
	  if (path.length == 0 || root == undefined)
	    return root;
	  else
	    return getIn(root[path[0]], path.slice(1))
	};


	var setIn = function(root, path, value) {
	  if (path.length == 0)
	    return value;
	  else {
	    var child = (root == null) ? null : root[path[0]];
	    var value = setIn(child || [], path.slice(1), value);
	    return merge(root, object(path[0], value));
	  }
	};


	var prune = function(root) {
	  var result, isArray, key, val

	  if (root == null || root === '')
	    result = null;
	  else if (root.constructor === Array || root.constructor === Object) {
	    isArray = Array.isArray(root); 
	    result = isArray ? [] : {};
	    for (key in root) {
	      val = prune(root[key]);
	      if (val != null) {
	        if (isArray)
	          result.push(val);
	        else
	          result[key] = val;
	      }
	    }

	    if (Object.keys(result).length == 0)
	      result = null;
	  } else
	    result = root;

	  return result;
	};


	var split = function(pred, obj) {
	  var good = {};
	  var bad = {};

	  for (key in obj) {
	    var val = obj[key];
	    if (pred(key, val))
	      good[key] = val;
	    else
	      bad[key] = val;
	  }

	  return [good, bad];
	};


	var map = function(fn, obj) {
	  var output = {};
	  var key;

	  for (key in obj)
	    output[key] = fn(obj[key]);

	  return output;
	};


	var mapKeys = function(fn, obj) {
	  var output = {};
	  var key;

	  for (key in obj)
	    output[fn(key)] = obj[key];

	  return output;
	};


	module.exports = {
	  object : object,
	  merge  : merge,
	  getIn  : getIn,
	  setIn  : setIn,
	  prune  : prune,
	  split  : split,
	  map    : map,
	  mapKeys: mapKeys
	};


/***/ }
/******/ ])
});
