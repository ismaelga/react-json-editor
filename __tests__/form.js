jest.dontMock('./schema.json')
    .dontMock('./schema2.json')
    .dontMock('immutable')
    .dontMock('..');

describe('React Form', () => {
  const React = require('react');
  const ReactDOM = require('react-dom');
  const TestUtils = require('react-addons-test-utils');
  const Form = require("..");
  const schema = require('./schema2.json');
  const schema2 = require('./schema.json');
  const Immutable = require('immutable');

  it('should render all three levels', function() {
    const renderedForm = TestUtils.renderIntoDocument(<Form schema={schema2}/>);
    const likeMovieSelect = TestUtils.scryRenderedDOMComponentsWithTag(renderedForm, "select")[1]

    //Set value of first dropdown to 'maybe'
    // Note: Simply changing property 'value' will not trigger the event, we must also trigger the value onChange event.
    likeMovieSelect.value = "yes";
    TestUtils.Simulate.change(likeMovieSelect, { value : "yes" });

    // Count amount of selects present in form
    var count = TestUtils.scryRenderedDOMComponentsWithTag(renderedForm, "select").length
    expect(count).toEqual(3);

    // Rinse and repeat...
    var faveMovieSelect = TestUtils.scryRenderedDOMComponentsWithTag(renderedForm, "select")[2];
    faveMovieSelect.value = "bar";
    TestUtils.Simulate.change(faveMovieSelect, { value : "bar"});

    count = TestUtils.scryRenderedDOMComponentsWithTag(renderedForm, "select").length
    expect(count).toEqual(4);
    expect(renderedForm.state.errors).toEqual({});
  }),

  it('should purge non-rendered data from state', () => {
    const renderedForm = TestUtils.renderIntoDocument(<Form schema={schema2}/>);
    const likeColorSelect = TestUtils.scryRenderedDOMComponentsWithTag(renderedForm, "select")[0];

    // First set value of select to yes to trigger rendering of second (optional) dropdown, specific to this case
    likeColorSelect.value = 'yes';
    TestUtils.Simulate.change(likeColorSelect, { value : "yes" });

    // Now set the (optional) dropdown value
    const faveColorSelect =
      Immutable.fromJS(TestUtils.scryRenderedDOMComponentsWithTag(renderedForm, 'select'))
               .find(c =>
                 Immutable.List(c.options)
                          .map(o => o.value)
                          .includes('red')
                )

    faveColorSelect.value = 'red';
    TestUtils.Simulate.change(faveColorSelect, { value : 'red' });

    // Lastly, change the first dropdown back to 'No' triggering the unrendering of the optional value input
    // And presumably the purging of that value from the state
    likeColorSelect.value = 'no';
    TestUtils.Simulate.change(likeColorSelect, { value : "no" });

    // Assert that optional input derendered
    const selectComponents = TestUtils.scryRenderedDOMComponentsWithTag(renderedForm, 'select');
    expect(selectComponents.indexOf(faveColorSelect)).toEqual(-1);

    //Assert that derendered data is removed from the state
    const expected = {
      color : {
        hasFave : 'no'
      }
    };

    const actual = renderedForm.state.values;
    expect(actual).toEqual(expected);
    expect(renderedForm.state.errors).toEqual({});
  }),

  it('should display other labels for options if enumNames property exists, simple test', () => {
    const renderedForm = TestUtils.renderIntoDocument(<Form schema={schema2}/>);
    const likeColorSelect = TestUtils.scryRenderedDOMComponentsWithTag(renderedForm, "select")[0];
    const expectedLabels = [
      "Please select an option below",
      "Yes!",
      "Nope..."
    ];

    const actualLabels =
      Immutable.List(likeColorSelect.options)
               .map(o => o.innerHTML)
               .toArray();

     expect(actualLabels).toEqual(expectedLabels);
  }),
  
  it('should render inputComponent', () => {
     const TestComponent = React.createClass({
          render() {
            return <p className="test">Hello, world!</p>;  
          }
      });
      
      const handlers = {
          testComponent : TestComponent
      };
      const renderedForm = TestUtils.renderIntoDocument(<Form schema={schema}
                                                              handlers={handlers}/>);
                                                              
      const paragraph = TestUtils.findRenderedDOMComponentWithClass(renderedForm, "test");
      
      expect(TestUtils.isCompositeComponentWithType(paragraph, TestComponent));
  }),
  
  it('should render nested inputComponent', () => {
      const TestComponent = React.createClass({
          render() {
            return <p className="test">Hello, world!</p>;  
          }
      });
      
      const handlers = {
          testComponent : TestComponent
      };
      
      const nestedSchema = {
          "properties": {
              "Test": {
                  "x-hints": {
                      "form": {
                          "inputComponent": "testComponent"
                      }
                  }
              }
          }
      };
      const renderedForm = TestUtils.renderIntoDocument(<Form schema={nestedSchema}
                                                              handlers={handlers}/>);
                                                              
      const paragraph = TestUtils.findRenderedDOMComponentWithClass(renderedForm, "test");
      
      expect(TestUtils.isCompositeComponentWithType(paragraph, TestComponent));
  }),
 
  it('should feed schema to inputComponent', () => {
      const TestComponent = React.createClass({
          componentDidMount() {
              expect(this.props.schema).toEqual(schema);              
          },
          
          render() {
            return <p>Test</p>;  
          }
      });
      const handlers = {
          testComponent : TestComponent
      };
      const renderedForm = TestUtils.renderIntoDocument(<Form schema={schema}
                                                              handlers={handlers}/>);
  });
});
