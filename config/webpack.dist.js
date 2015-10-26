'use strict';
var extend = require('xtend');

var common = require('./webpack.common.dist');


module.exports = extend(common, {
    output: {
        path: './dist',
        filename: 'react-json-editor.js',
        libraryTarget: 'umd',
        library: 'react-json-editor',
    },
});
