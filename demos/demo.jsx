'use strict';

var React = require('react');
var Form  = require('..');


var schema = {
  definitions: {
    weight: {
      title: "Weight",
      type: "object",
      properties: {
        amount: {
          type: "number",
          minimum: 0,
          exclusiveMinimum: true
        },
        unit: {
          enum: [ "kg", "lbs" ],
          // optional, see https://github.com/json-schema/json-schema/wiki/enumNames-(v5-proposal)
          // this is handy for i18n since then you want to separate values/names
          enumNames: [ "KG", "lbs"]
        }
      }
    }
  },
  title: "Example form",
  description: "A form based on a schema",
  type: "object",
  required: ["name", "age"],
  'x-hints': {
    form: {
      classes: 'my-nice-form'
    }
  },
  properties: {
    name: {
      title: "Your name",
      description: "Your full name",
      type: "string",
      minLength: 3,
      maxLength: 40,
      pattern: "^[A-Z][a-z]*(\\s[A-Z][a-z]*)*$",
      'x-hints': {
        form: {
          classes: 'important-field'
        }
      }
    },
    age: {
      title: "Your age",
      type: "integer",
      minimum: 1
    },
    weight: {
      title: "Your weight",
      "$ref": "#/definitions/weight"
    },
    color: {
      title: "Favourite colour",
      type: "object",
      properties: {
        hasFave: {
          title: "Do you have a favourite colour?",
          type: "string"
        }
      },
      oneOf: [
        {
        },
        {
          properties: {
            hasFave: {
              enum: [ "no" ]
            }
          }
        },
        {
          properties: {
            hasFave: {
              enum: [ "yes" ]
            },
            fave: {
              title: "Your favourite colour",
              type: "string",
              enum: [
                "", "red", "green", "blue", "yellow", "orange", "purple", "other"
              ]
            }
          }
        }
      ],
      "x-hints": {
        form: {
          selector: "hasFave",
        }
      }
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
    }
  }
};


var SchemaEditor = React.createClass({
  displayName: 'SchemaEditor',

  preventSubmit: function(event) {
    event.preventDefault();
  },
  render: function() {
    return (
      <form onSubmit={this.preventSubmit}>
        <textarea rows="30" cols="60" onChange={this.props.onChange} value={this.props.value}></textarea>
      </form>
    );
  }
});


var FieldWrapper = React.createClass({
  render: function() {
    var errors  = (this.props.errors || []).join('\n');
    var classes = [].concat(errors ? 'error' : [],
                            'form-element',
                            this.props.classes || []);
    var helpClasses  =
      'form-help' + (this.props.description ? '' : ' invisible');
    var errorClasses =
      'form-error' + (errors ? '' : ' invisible');

    return (
        <div className={classes.join(' ')} key={this.props.label}>
          <label htmlFor={this.props.label}>
            {this.props.title}
          </label>
          <span className={helpClasses} title={this.props.description}>
            ?
          </span>
          {this.props.children}
          <span className={errorClasses} title={errors}>
            !
          </span>
        </div>
    );
  }
});


var SectionWrapper = React.createClass({
  render: function() {
    var errors  = (this.props.errors || []).join('\n');
    var level = this.props.path.length;
    var classes = [].concat(errors ? 'error' : [],
                            'form-section',
                            (level > 0 ? 'form-subsection' : []),
                            this.props.classes || []);
    var helpClasses  =
      'form-help' + (this.props.description ? '' : ' hidden');
    var errorClasses =
      'form-error' + (errors ? '' : ' hidden');

    return (
        <fieldset className={classes.join(' ')} key={this.props.label}>
          <legend className="form-section-title">
            {this.props.title}
            <span className={helpClasses} title={this.props.description}>
              ?
            </span>
            <span className={errorClasses} title={errors}>
              !
            </span>
          </legend>
          {this.props.children}
        </fieldset>
    );
  }
});


module.exports = React.createClass({
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
  onFormSubmit: function(data, value, errors) {
    this.setState({ button: value, data: data, errors: errors });
  },
  render: function() {
    return (
      <div>
        <ul className="flexContainer">
          <li className="flexItem">
            <h3>Schema:</h3>
            <SchemaEditor value={this.state.text} onChange={this.update} />
          </li>
          <li className="flexItem">
            <h3>Generated form:</h3>
            <Form buttons={['Dismissed', 'Energise']}
              onSubmit={this.onFormSubmit}
              schema={this.state.schema}
              fieldWrapper={FieldWrapper}
              sectionWrapper={SectionWrapper}
            />
          </li>
          <li className="flexItem">
            <h3>Data:</h3>
            <pre>{JSON.stringify(this.state.data, null, 4)}</pre>

            <h3>Button:</h3>
            <p>{this.state.button}</p>

            <h3>Errors:</h3>
            <pre>{JSON.stringify(this.state.errors, null, 4)}</pre>
          </li>
        </ul>
      </div>
    );
  }
});
