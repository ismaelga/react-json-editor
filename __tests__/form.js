jest.dontMock('./formSchema.json')
    .dontMock('..');

describe('React Form', () => {
  it('Should render all three levels', function() {
    var React = require('react');
    var ReactDOM = require('react-dom');
    var TestUtils = require('react-addons-test-utils');
    const Form = require("..");

    var schema = require('./formSchema.json')
    var renderedForm = TestUtils.renderIntoDocument(<Form schema = {schema}/>);
    var likeColorSelect = TestUtils.findRenderedDOMComponentWithTag(renderedForm, "select");

    //Set value of first dropdown to 'maybe'
    // Note: Simply changing property 'value' will not trigger the event, we must also trigger the value onChange event.
    likeColorSelect.value = "maybe";
    TestUtils.Simulate.change(likeColorSelect, { value : "maybe" });

    // Count amount of selects present in form
    var count = TestUtils.scryRenderedDOMComponentsWithTag(renderedForm, "select").length
    expect(count).toEqual(2);

    // Rinse and repeat...
    var likeColorSelect2 = TestUtils.scryRenderedDOMComponentsWithTag(renderedForm, "select")[1];
    likeColorSelect2.value = "Yes";
    TestUtils.Simulate.change(likeColorSelect2, { value : "Yes"});

    count = TestUtils.scryRenderedDOMComponentsWithTag(renderedForm, "select").length
    expect(count).toEqual(3);
  });

});
