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

var React = require('react');

var ou = require('plexus-objective');

var $ = React.DOM;


var normalizer = {};


normalizer.string = function(text) {
  return text
    .replace(/\s+/g, ' ')
    .replace(/^ /, '');
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
  return normalizer.string(text).trim();
};

parser.integer = function(text) {
  return parseInt(normalizer.integer(text));
};

parser.number = function(text) {
  return parseFloat(normalizer.number(text));
};


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


var commonAttributes = function(props) {
    return {
      className: errorClass(props.errors),
      title    : makeTitle(props.schema.description, props.errors)
    };
};


var InputField = React.createClass({
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
    var title = this.props.schema.title;
    return $.p(commonAttributes(this.props),
               title ? $.label(null, title) : $.span(),
               title ? $.br() : $.span(),
               $.input({ type      : "text",
                         value     : this.props.value,
                         onKeyPress: this.handleKeyPress,
                         onChange  : this.handleChange }));
  }
});


var CheckBox = React.createClass({
  handleChange: function(event) {
    var val = event.target.checked;
    this.props.update(this.props.path, val, val);
  },
  render: function() {
    return $.p(commonAttributes(this.props),
               $.input({ type: "checkbox",
                         checked: this.props.value,
                         onChange: this.handleChange }),
               $.label(null, this.props.schema.title));
  }
});


var Selection = React.createClass({
  handleChange: function(event) {
    var val = event.target.value;
    this.props.update(this.props.path, val, val);
  },
  render: function() {
    var selected = this.props.selected;

    return $.p(commonAttributes(this.props),
               $.select({ value: this.props.selected,
                          onChange: this.handleChange },
                        this.props.options.map(function(opt) {
                          return $.option({ key: opt, value: opt }, opt);
                        })),
               $.label(null, this.props.schema.title));
  }
});


var FileField = React.createClass({
  getInitialState: function() {
    return {
      name: null,
      type: null,
      data: null
    }
  },
  loadFile: function(event) {
    var files = event.target.files;
    var reader = new FileReader();

    reader.onload = function(event) {
      var val = event.target.result;
      this.props.update(this.props.path, val, val);
    }.bind(this);

    if (files[0])
      reader.readAsText(files[0]);
  },
  render: function() {
    var title = this.props.schema.title;
    return $.p(commonAttributes(this.props),
               title ? $.label(null, title) : $.span(),
               title ? $.br() : $.span(),
               $.input({ type    : "file",
                         onChange: this.loadFile }));
  }
});


var ArrayHead = React.createClass({
  render: function() {
    return $.p(commonAttributes(this.props),
               $.label(null, this.props.schema.title));
  }
});


var makeKey = function(path) {
  return path.join('_');
};


var fieldListFromObject = function(props) {
  var list = [];
  if (props.schema.description)
    list.push($.p({ key: makeKey(props.path) },
                    props.schema.description));
  var key;
  for (key in props.schema.properties) {
    list = list.concat(fieldList(ou.merge(props, {
      schema: props.schema.properties[key],
      path  : props.path.concat(key)
    })));
  }
  return list;
};


var fieldListFromArray = function(props) {
  var list = [];
  var values = props.getValue(props.path) || [];
  var i;

  list.push(ArrayHead(ou.merge(props, {
    key   : makeKey(props.path),
    errors: props.getErrors(props.path)
  })));

  for (i = 0; i <= values.length; ++i) {
    list.push(fieldList(ou.merge(props, {
      schema: props.schema.items,
      path  : props.path.concat(i),
    })));
  }
  return list;
};


var fieldList = function(props) {
  if ((ou.getIn(props.hints, props.path) || {}).fileUpload == true) {
    return [
      FileField(ou.merge(props, {
        key    : makeKey(props.path),
        errors : props.getErrors(props.path)
      }))
    ];
  }

  if (props.schema['enum']) {
    return [
      Selection(ou.merge(props, {
        key     : makeKey(props.path),
        options : props.schema['enum'],
        selected: props.getValue(props.path),
        errors  : props.getErrors(props.path)
      }))
    ];
  }

  switch (props.schema.type) {
  case "boolean":
    return [
      CheckBox(ou.merge(props, {
        key    : makeKey(props.path),
        checked: props.getValue(props.path) || false,
        errors : props.getErrors(props.path)
      }))
    ];
  case "object" :
    return fieldListFromObject(props);
  case "array"  :
    return fieldListFromArray(props);
  case "number" :
  case "integer":
  case "string" :
  default:
    return [
      InputField(ou.merge(props, {
        key   : makeKey(props.path),
        value : props.getValue(props.path) || '',
        errors: props.getErrors(props.path),
        type  : props.schema.type
      }))
    ];
  }
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


var Form = React.createClass({
  getInitialState: function() {
    var errors =
      hashedErrors(this.props.validate(this.props.schema, this.props.values));
    return { values: this.props.values,
             output: this.props.values,
             errors: errors };
  },
  componentWillReceiveProps: function(props) {
    var values = props.values || this.state.values;
    var output = props.values || this.state.output;
    this.setState({
      values: values,
      output: output,
      errors: hashedErrors(this.props.validate(props.schema, output))
    });
  },
  setValue: function(path, raw, parsed) {
    var values = ou.prune(ou.setIn(this.state.values, path, raw));
    var output = ou.prune(ou.setIn(this.state.output, path, parsed));
    var errors = hashedErrors(this.props.validate(this.props.schema, output));
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
  preventSubmit: function(event) {
    event.preventDefault();
  },
  handleSubmit: function(event) {
    this.props.onSubmit(this.state.output, event.target.value);
  },
  handleKeyPress: function(event) {
    if (event.keyCode == 13 && this.props.enterKeySubmits)
      this.props.onSubmit(this.state.output, this.props.enterKeySubmits);
  },
  render: function() {
    var schema = this.props.schema;
    var fields = fieldList({
      schema   : this.props.schema,
      hints    : this.props.hints,
      path     : [],
      update   : this.setValue,
      getValue : this.getValue,
      getErrors: this.getErrors
    });
    var buttons =
      (this.props.buttons || ['Cancel', 'Submit']).map(function(value) {
        return $.input({ type   : 'submit',
                         key    : value,
                         value  : value,
                         onClick: this.handleSubmit })
      }.bind(this));

    return $.form({ onSubmit: this.preventSubmit,
                    onKeyPress: this.handleKeyPress
                  },
                  $.fieldset(null,
                             $.legend(null, schema.title),
                             $.p(null, schema.description),
                             fields),
                  buttons);
  }
});

module.exports = Form;
