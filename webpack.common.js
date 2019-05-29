const path = require('path');

module.exports = {
  entry: {
    popup: path.join(__dirname, 'src/popup/index.tsx'),
    background: path.join(__dirname, 'src/background.ts'),
    contentScript: path.join(__dirname, 'src/contentScript.ts')
  },
  output: {
    path: path.join(__dirname, 'dist/js'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        exclude: /(node_modules)|(dist)/,
        test: /\.t|jsx?$/,
        use: [{ loader: 'babel-loader' }, { loader: 'ts-loader' }]
      },
      {
        exclude: /node_modules/,
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader' // Creates style nodes from JS strings
          },
          {
            loader: 'css-loader' // Translates CSS into CommonJS
          },
          {
            loader: 'sass-loader' // Compiles Sass to CSS
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  }
};
