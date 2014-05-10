'use strict';

var React = require('react');

var validate = require('plexus-validate');
var Form     = require('../index');

var $ = React.DOM;

window.React = React;


var schema = {
  title: "Example form",
  description: "A form based on a schema",
  type: "object",
  required: ["name", "gender"],
  properties: {
    name: {
      title: "Your name",
      description: "Your full name",
      type: "string",
        minLength: 3,
        maxLength: 40,
        pattern: "^[A-Z][a-z]*(\\s[A-Z][a-z]*)*$"
    },
    age: {
      title: "Your age",
      type: "integer",
      minimum: 1
    },
    weight: {
      title: "Your weight in kg",
      type: "number",
      minimum: 0,
      exclusiveMinimum: true
    },
    gender: {
      title: "Do you have a gender?",
      type: "boolean"
    },
    interests: {
      title: "Your interests",
      type: "array",
      minItems: 2,
      items: {
        type: "string",
        minLength: 2
      }
    },
    languages: {
      title: "Languages you speak",
      type: "array",
      maxItems: 2,
      items: {
        type: "string"
      }
    },
    motto: {
      description: "Your motto (file upload)",
      type: "object",
      properties: {
        content: {
          type: "object",
          "x-hints": {
            "fileUpload": {
              "mode": "text"
            }
          }
        },
        caption: {
          title: "Caption",
          type: "string"
        }
      }
    }
  }
};


var SchemaEditor = React.createClass({
  displayName: 'SchemaEditor',

  preventSubmit: function(event) {
    event.preventDefault();
  },
  render: function() {
    return $.form({ onSubmit: this.preventSubmit },
                  $.textarea({ rows    : 30,
                               cols    : 60,
                               onChange: this.props.onChange,
                               value   : this.props.value }));
  }
});


var FormDemoPage = React.createClass({
  displayName: 'FormDemoPage',

  getInitialState: function() {
    return {
      schema: schema,
      text  : JSON.stringify(schema, null, 2)
    };
  },
  update: function(event) {
    var text = event.target.value;
    var schema;
    try {
      schema = JSON.parse(event.target.value);
      this.setState({ schema: schema, text: text });
    } catch (ex) {
      this.setState({ text: text });
    }
  },
  onFormSubmit: function(data, value) {
    this.setState({ button: value, data: data });
  },
  render: function() {
    return $.div(null,
                 $.ul({ className: 'flexContainer' },
                      $.li({ className: 'flexItem' },
                           $.h3(null, "Schema:"),
                           SchemaEditor({ value   : this.state.text,
                                          onChange: this.update })),
                      $.li({ className: 'flexItem' },
                           $.h3(null, "Generated form:"),
                           Form({
                             buttons: ['Dismissed', 'Energise'],
                             onSubmit: this.onFormSubmit,
                             schema: this.state.schema,
                             validate: validate
                           })),
                      $.li({ className: 'flexItem' },
                           $.h3(null, "Data:"),
                           $.pre(null,
                                 JSON.stringify(this.state.data, null, 4)),
                           $.h3(null, "Button:"),
                           $.p(null, this.state.button))
                     )
                );
  }
});


React.renderComponent(FormDemoPage(), document.getElementById('react-main'));
