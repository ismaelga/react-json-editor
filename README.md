# plexus-form

A dynamic form component for [React](http://facebook.github.io/react/) using a specification format based on [JSON-Schema](http://json-schema.org/).

The full code for the demo above can be found at https://github.com/AppliedMathematicsANU/plexus-form/blob/master/demos/demo.jsx.

Plexus-form takes a JavaScript object describing the shape of the data we want
a user to provide - a *schema* - and automatically creates a form based on
that schema. It also validates user inputs by calling a pluggable validator
which uses the same schema.


## Minimal example:

    var React    = require('react');
    var validate = require('plexus-validate');
    var Form     = require('plexus-form');

    var schema = {
      title      : "My pretty form",
      description: "Declarative pure data DSLs are the best.",
      type       : "object",
      properties : {
        comment: {
          title      : "Your comment",
          description: "Type something here.",
          type       : "string",
          minLength  : 1
        }
      }
    };

    var onSubmit = function(data, buttonValue, errors) {
      alert('Data  : '+JSON.stringify(data)+'\n'+
            'Button: '+buttonValue+'\n'+
            'Errors: '+JSON.stringify(errors));
    };

    React.render(<Form
                   schema   = {schema}
                   validate = {validate}
                   onSubmit = {onSubmit} />,
                 document.body);


## Differences between JSON-Schema and plexus-form schemas:

Plexus-form and
[plexus-validate](https://github.com/AppliedMathematicsANU/plexus-validate)
take a plain JavaScript data object as input rather than a JSON-formatted
string.

The following JSON-Schema properties are supported:

  - `description`
  - `enum`
  - `enumNames`
  - `items`
  - `oneOf`
  - `properties`
  - `title`
  - `type`
  - `$ref`

Plexus-form extends the JSON-Schema specification with two new properties
`x-hints` and `x-ordering`. The latter, `x-ordering`, specifies a display
order for fields defined by the current object. The former, `x-hints`, can be
used for additional information on how to handle or display a data
element. Currently, plexus-form only uses this to support user-defined field
handlers.


## `x-ordering` example:

    var schema = {
      type      : "object",
      properties: {
        comment: { title: "Comment" },
        email  : { title: "Email" },
        name   : { title: "Name" }
      },
      "x-ordering": ["name", "email", "comment"]
    };


## `x-hints` example:

    var schema = {
      title    : "Mouse Tracer",
      "x-hints": {
        form: {
          inputComponent: "tracer"
        }
      }
    };

    var Tracer = React.createClass({
      componentDidMount: function() {
        document.addEventListener('mousemove', this.handleMouseMove);
      },

      componentWillUnmount: function() {
        document.removeEventListener('mousemove', this.handleMouseMove);
      },

      handleMouseMove: function(event) {
        this.props.onChange([event.pageX, event.pageY]);
      },

      handleKeyPress: function(event) {
        this.props.onKeyPress(event);
      },

      render: function() {
        return <span/>
      }
    });

    var handlers = {
      tracer: Tracer
    };

    var onSubmit = function(data, buttonValue, errors) {
      console.log(data);
    };

    React.render(<Form
                   schema   = {schema}
                   validate = {validate}
                   onSubmit = {onSubmit}
                   handlers = {handlers}
                   submitOnChange = {true} />,
                 document.body);

# License

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
