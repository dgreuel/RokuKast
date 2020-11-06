const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
   entry: {
      popup: path.resolve(__dirname, "src/popup/index.tsx"),
      options: path.resolve(__dirname, "src/options/index.tsx"),
      background: path.resolve(__dirname, "src/background.ts"),
      contentScript: path.resolve(__dirname, "src/contentScript.ts")
   },
   output: {
      path: path.resolve(__dirname, 'dist'),
      filename: "[name].js"
   },
   plugins: [
      new CopyWebpackPlugin({
         patterns: [
            {
               from: "manifest.json",
               context: "src/"
            },
            {
               from: "images/**",
               context: "src/"
            }
         ]
      })
   ],
   module: {
      rules: [
         {
            exclude: /(node_modules)|(dist)/,
            test: /\.t|jsx?$/,
            loader: require.resolve("ts-loader"),
         },
         {
            exclude: /node_modules/,
            test: /\.scss$/,
            use: [
               {
                  loader: "style-loader" // Creates style nodes from JS strings
               },
               {
                  loader: "css-loader" // Translates CSS into CommonJS
               },
               {
                  loader: "sass-loader" // Compiles Sass to CSS
               }
            ]
         }
      ]
   },
   resolve: {
      extensions: [".ts", ".tsx", ".js", ".html", ".json"]
   }
};
