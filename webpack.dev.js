const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge.merge(common, {
   mode: "development",
   devtool: "inline-source-map"
});
