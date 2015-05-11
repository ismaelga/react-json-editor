'use strict';

var React = require('react');
var $ = React.DOM;

var normalizer = require('./utils/normalizer');
var parser = require('./utils/parser');


var Selection = React.createClass({
  displayName: 'Selection',

  normalize: function(text) {
    // XXXXX: assume string in case type isn't set
    var type = this.props.type || 'string';

    return normalizer[type](text);
  },
  parse: function(text) {
    // XXXXX: assume string in case type isn't set
    var type = this.props.type || 'string';

    return parser[type](text);
  },
  handleChange: function(event) {
    var val = this.normalize(event.target.value);
    this.props.update(this.props.path, val, this.parse(val));
  },
  render: function() {
    var names = this.props.names;

    return $.select(
      {
        name    : this.props.label,
        value   : this.props.value || this.props.values[0],
        onChange: this.handleChange
      },
      this.props.values.map(function(opt, i) {
        return $.option({ key: opt, value: opt }, names[i] || opt);
      }));
  }
});

module.exports = Selection;
