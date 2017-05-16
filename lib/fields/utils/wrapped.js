'use strict';

var React = require('react');
var $ = React.DOM;

var ou = require('../../objectUtils');


var errorClass = function(errors) {
  if(!errors || errors.length === 0) {
    return '';
  }

  return 'error';
};

var makeTitle = function(description, errors) {
  var parts = [];
  if (description && description.length > 0) {
    parts.push(description);
  }
  if (errors && errors.length > 0) {
    parts.push(errors.join('\n'));
  }
  return parts.join('\n\n');
};

var FieldWrapper = React.createClass({
  shouldComponentUpdate: function(nextProps) {
    return this.props.value !== nextProps.value;
  },
  render: function() {
    var classes = [].concat(errorClass(this.props.errors) || [],
                            'form-element',
                            this.props.classes || []);

    return $.div(
      {
        className: classes.join(' '),
        key      : this.props.label,
        title    : makeTitle(this.props.description, this.props.errors)
      },
      $.label(
        {
          htmlFor: this.props.label
        },
        this.props.title),
      this.props.children);
  }
});

var SectionWrapper = React.createClass({
  shouldComponentUpdate: function(nextProps) {
    return this.props.value !== nextProps.value;
  },
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
        key      : this.props.label
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

var propsForWrapper = function(props, section) {
  var propsFW = {
    key        : props.key,
    label      : props.label,
    path       : props.path,
    errors     : props.errors,
    classes    : ou.getIn(props.schema, ['x-hints', 'form', 'classes']),
    title      : props.schema.title,
    type       : props.schema.type,
    description: props.schema.description,
    schema     : props.schema,
    value      : props.value
  };

  if(section && props.isArrayItem) {
    if(props.isArrayItem) {
      var vals = props.getValue(props.path);
      var title = props.title;
      if(vals) {
        var itemHeaderKey = ou.getIn(props.schema, ['x-hints', 'itemHeader', "property"]);
        var itemHeader = (itemHeaderKey && vals[itemHeaderKey]) || vals.title || vals.name;
        title = title && itemHeader ? title + " - " + itemHeader : itemHeader || title;
      }

      propsFW = ou.merge(propsFW, {
        title        : title || propsFW.title,
        move         : props.move,
        moveUp       : props.moveUp,
        moveDown     : props.moveDown,
        canMoveUp    : props.canMoveUp,
        canMoveDown  : props.canMoveDown,
        removeItem   : props.removeItem,
        canRemoveItem: props.canRemoveItem
      });
    }

    propsFW = ou.merge(propsFW, {
      isArrayItem: props.isArrayItem
    });
  }

  return propsFW;
};

exports.section = function(props, fields) {
  if (React.isValidElement(props.sectionWrapper)) {
    return React.cloneElement(props.sectionWrapper, propsForWrapper(props, true), fields);
  }
  return React.createElement(props.sectionWrapper || SectionWrapper,
    propsForWrapper(props, true),
    fields);
};

exports.field = function(props, field) {
  if (React.isValidElement(props.fieldWrapper)) {
    return React.cloneElement(props.fieldWrapper, propsForWrapper(props), field);
  }
  return React.createElement(props.fieldWrapper || FieldWrapper,
    propsForWrapper(props),
    field);
};
