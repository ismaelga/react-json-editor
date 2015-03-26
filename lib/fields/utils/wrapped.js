'use strict';

var React = require('react');
var $ = React.DOM;

var ou = require('plexus-objective');


var errorClass = function(errors) {
  if(!errors || errors === null || errors.length === 0) {
    return '';
  }

  return 'error';
};

var makeTitle = function(description, errors) {
  var parts = [];
  if (description !== null && description.length > 0) {
    parts.push(description);
  }
  if (errors !== null && errors.length > 0) {
    parts.push(errors.join('\n'));
  }
  return parts.join('\n\n');
};

var FieldWrapper = React.createClass({
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

var SectionWrapper = React.createClass({
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
};

exports.section = function(props, fields) {
  return React.createElement(props.sectionWrapper || SectionWrapper,
    propsForWrapper(props),
    fields);
};

exports.field = function(props, field) {
  return React.createElement(props.fieldWrapper || FieldWrapper,
    propsForWrapper(props),
    field);
};
