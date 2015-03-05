'use strict';

require('purecss/pure.css');
require('highlight.js/styles/github.css');
require('react-ghfork/gh-fork-ribbon.ie.css');
require('react-ghfork/gh-fork-ribbon.css');
require('./main.css');
require('./demo.css');


var React = require('react'),
    App = require('./app');


React.render(<App />, document.body);
