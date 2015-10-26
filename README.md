# react-json-editor

** This is a fork of plexus-form with the intent to keep it maintained **

A dynamic form component for [React](http://facebook.github.io/react/) using a
specification format based on [JSON-Schema](http://json-schema.org/).

**[Demo](http://appliedmathematicsanu.github.io/plexus-form/)**

The full code for the demo can be found at
https://github.com/AppliedMathematicsANU/plexus-form/blob/master/demos/demo.jsx.

react-json-editor takes a JavaScript object describing the shape of the data we want
a user to provide - a *schema* - and automatically creates a form based on
that schema. It also validates user inputs using the same schema.


## Minimal example:

    var React    = require('react');
    var Form     = require('react-json-editor');

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
                   onSubmit = {onSubmit} />,
                 document.body);


## Differences between JSON-Schema and react-json-editor schemas:

react-json-editor take a plain JavaScript data object as input rather than a JSON-formatted
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

Additional properties relevant to data validation are implemented by
plexus-validate.

JSON-Schema references can only point to elements within the schema object
itself. URI references are not supported.

react-json-editor extends the JSON-Schema specification with two new properties
`x-hints` and `x-ordering`. The latter, `x-ordering`, specifies a default
order for the elements under the current object. The former, `x-hints`, can be
used to annotate a schema with additional hints on how the data is to be
handled or displayed. The relevant pieces of information for react-json-editor are
found under `schema["x-hints"].form`. We'll explore these extension in more
detail in the following sections.


## Enforced display order example:

    var schema = {
      type      : "object",
      properties: {
        comment: { title: "Comment" },
        email  : { title: "Email" },
        name   : { title: "Name" }
      },
      "x-ordering": ["name", "email", "comment"]
    };


## Custom CSS classes example:

react-json-editor assigns the following CSS classes automatically:

- `form-section`
- `form-subsection`
- `form-section-title`
- `form-element`

Additional CSS classes can be specified via `x-hints` like so:

    var schema = {
      type      : "object",
      properties: {
        name : {
          title: "Name",
          "x-hints": {
            form: {
              classes: [ "form-text-field", "form-name-field" ]
            }
          }
        },
        email: {
          title: "Email",
          "x-hints": {
            form: {
              classes: [ "form-text-field", "form-email-field" ]
            }
          }
        }
      },
      "x-hints": {
        form: {
          classes: [ "form-person-section" ]
        }
      }
    };


## Alternatives selection example:

    var schema = {
      type      : "object",
      properties: {
        contact: {
          title      : "Contact details",
          description: "How would you like to be contacted?",
          type       : "object",
          properties : {
            contactType: {
              title      : "Contact medium",
              description: "Please pick your preferred medium"
            }
          },
          oneOf: [
            {
              properties: {
                contactType: { enum: [ "Email" ] },
                email      : { title: "Email address" }
              }
            },
            {
              properties: {
                contactType: { enum: [ "Telephone" ] },
                phoneNumber: { title: "Telephone number" }
              }
            },
            {
              properties: {
                contactType: { enum: [ "Physical mail" ] },
                address    : { title: "Street address" },
                postcode   : { title: "Post or area code" },
                state      : { title: "State or province" },
                country    : { title: "Country" }
              }
            }
          ],
          "x-hints": { form: { selector: "contactType" } }
        }
      }
    };


## User-defined input component example:

The following example shows how to associate a user-defined input handler with
a data element. The association happens indirectly via a symbolic name and a
`handler` object that assigns functions to names so that the schema itself
remains easily serializable. We use a very simplistic file uploader component
as a demonstration case. Other useful applications of these technique could be
an autocompleting text field or a color picker.

The React component handling a data element (here `Uploader`) must call
`this.props.onChange` whenever the data has changed. It should delegate
low-level key press events it does not handle itself to
`this.props.onKeyPress`, which enables the `<Form>` component to handle the
"Enter" key consistently throughout the form.

    var schema = {
      "x-hints" : {
        form: {
          inputComponent: "uploader"
        }
      }
    };

    var Uploader = React.createClass({
      componentDidMount: function() {
        var input = document.createElement('input');
        input.type = 'file';
        input.multiple = false;
        input.addEventListener('change', this.loadFile);
        this._input = input;
      },

      loadFile: function(event) {
        var files = event.target.files;
        var handleData = this.handleData;
        var file = files[0];
        var reader = new FileReader();

        reader.onload = function(event) {
          handleData(file, event.target.result);
        };

        reader.readAsText(file);
      },

      handleData: function(file, data) {
        this.props.onChange({
          name: file.name,
          type: file.type,
          size: file.size,
          data: data.slice(0, 1000) // truncate data in this demo
        });
      },

      openSelector: function() {
        this._input.click();
      },

      handleKeyPress: function(event) {
        this.props.onKeyPress(event);
      },

      render: function() {
        return (
          <button onClick = { this.openSelector }>
            Select a file
          </button>
        );
      }
    });

    var onSubmit = function(data, buttonValue, errors) {
      alert('Data  : '+JSON.stringify(data)+'\n'+
            'Button: '+buttonValue+'\n'+
            'Errors: '+JSON.stringify(errors));
    };

    var handlers = {
      uploader: Uploader
    };

    React.render(<Form
                   buttons  = {[]}
                   schema   = {schema}
                   onSubmit = {onSubmit}
                   handlers = {handlers}
                   submitOnChange = {true} />,
                 document.body);

# License

The MIT License (MIT)

Copyright (c) 2015 The Australian National University

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
