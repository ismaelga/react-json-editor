'use strict';
var extend = require('xtend');

var common = require('./webpack.common.dist');


module.exports = extend(common, {
    output: {
        path: './dist',
        filename: 'plexus-form.js',
        libraryTarget: 'umd',
        library: 'PlexusForm',
    },
});
