'use strict';

var React = require('react');
var ou = require('../objectUtils');
var $ = React.DOM;

var normalizer = require('./utils/normalizer');
var parser = require('./utils/parser');


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
    if (event.keyCode === 13) {
      event.preventDefault();
    }
  },
  render: function() {
    var value = ou.isNil(this.props.value)? '' : this.props.value;
    return $.input({
      type      : "text",
      disabled  : this.props.disabled,
      name      : this.props.label,
      value     : value,
      onKeyPress: this.handleKeyPress,
      onChange  : this.handleChange });
  }
});

module.exports = InputField;
