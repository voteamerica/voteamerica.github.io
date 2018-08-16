const path = require('path');

const outputPath = path.resolve(__dirname, "scripts");

console.log("outputPath", outputPath);

module.exports = {
    watchOptions: {
        poll: 10000
    },
    devtool: "source-map",
    entry: "./webpack/entry.js",
    mode: "development",
    output: {
        path: outputPath,
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: [/(node_modules)/],
                use: [
                    {
                        loader: "babel-loader",
                        query: {
                            presets: [ "react"],
                            plugins: ["transform-object-rest-spread"]
                        }
                    }
                ]
            }
        ]
    }
};