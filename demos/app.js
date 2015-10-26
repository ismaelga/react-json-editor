'use strict';

var React = require('react');
var Fork = require('react-ghfork');

var Demo = require('./demo.jsx');

var readme = require('../README.md');


module.exports = React.createClass({
    render() {
        return <div className='pure-g'>
            <Fork className='right' project='ismaelga/react-json-editor'></Fork>
            <header className='pure-u-1'>
                <h1>react-json-editor</h1>

                <div className='description'>A dynamic form component for react using JSON-Schema.</div>
            </header>
            <article className='pure-u-1'>
                <section className='demonstration'>
                    <div className='description'>
                        <h2>Demonstration</h2>

                        <p>Tweak the schema and form below</p>

                        <Demo></Demo>
                    </div>
                </section>
                <section className='documentation'>
                    <h2>README</h2>

                    <div dangerouslySetInnerHTML={{__html: readme}}></div>
                </section>
            </article>
        </div>;
    },
});
