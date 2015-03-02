'use strict';


module.exports = {
    entry: './lib/index',
    resolve: {
        extensions: ['', '.js', '.jsx'],
    },
    externals: {
        react: 'react',
        'react/addons': 'react/addons'
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            loaders: ['jsx-loader?harmony'],
            exclude: /node_modules/,
        }]
    }
};
