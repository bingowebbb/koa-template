var PROD = process.argv.indexOf('-p') >= 0;
let webpack = require('webpack')
,   _       = require('lodash')
,   fs      = require('fs-extra')
,   path    = require('path')
,   OpenBrowserPlugin  = require('open-browser-webpack-plugin');

let VW_DIR  = path.join(__dirname, 'public/js');
let ENT_BUD_DIR = path.join(__dirname, 'public/build/js');

fs.emptyDirSync(ENT_BUD_DIR);
var config = [{
  plugins: [
    new webpack.DefinePlugin({
      'typeof __DEV__': JSON.stringify('boolean'),
      __DEV__: PROD ? false : true
    }),
  ],
  entry: {
    'appCard': path.join(VW_DIR, 'appCard.js')
  },
  output: {
    libraryTarget: 'umd',
    path: path.join(ENT_BUD_DIR),
    filename: PROD ? '[name].min.js' : '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|lib)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  }
},{
  plugins: [
    new OpenBrowserPlugin({ url: 'http://localhost:8084' }),
    new webpack.DefinePlugin({
      'typeof __DEV__': JSON.stringify('boolean'),
      __DEV__: PROD ? false : true
    })
  ],
  entry: {
    'appCardList': path.join(VW_DIR, 'appCardList.js')
  },
  output: {
    libraryTarget: 'umd',
    path: path.join(ENT_BUD_DIR),
    filename: PROD ? '[name].min.js' : '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|lib)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  }
}];

if (PROD) {
  config.forEach(function(v){
    _.isArray(v, 'plugins') && v.plugins.push(new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }));
  });
}

module.exports = config;
