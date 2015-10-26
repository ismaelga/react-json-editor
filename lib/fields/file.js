'use strict';

var React = require('react');
var $ = React.DOM;

var ou = require('../objectUtils');

var types = require('../types');
var wrapped = require('./utils/wrapped');


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
      if (this.props.mode === 'dataURL') {
        reader.readAsDataURL(file);
      }
      else {
        reader.readAsText(file);
      }
    }
  },
  render: function() {
    var fields = this.props.fields || {};
    var value = this.props.value || {};
    var list = [
      $.input({ key: "input", type: "file", onChange: this.loadFile }),
      $.dl({ key: "fileProperties" },
           $.dt(null, "Name"), $.dd(null, value.name || '-'),
           $.dt(null, "Size"), $.dd(null, value.size || '-'),
           $.dt(null, "Type"), $.dd(null, value.type || '-'))
    ];

    return wrapped.section(this.props, list.concat(types.object(fields, this.props)));
  }
});

module.exports = FileField;

