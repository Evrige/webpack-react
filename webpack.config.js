const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;

module.exports = {
    entry: ["@babel/polyfill","./src/index.js"],
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: filename("js"),
        clean: true
    },
    resolve: {
        extensions: [".js", ".jsx"]
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ["@babel/plugin-transform-runtime"]
                    }
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-react", '@babel/preset-env'],
                        plugins: ["@babel/plugin-transform-runtime"]
                    }
                }
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: 'file-loader'
            },
            {
                test: /\.s[ac]ss$/i,
                use: [{
                    loader: MiniCssExtractPlugin.loader
                }, "css-loader", "sass-loader"],
            },
        ],
    },
    plugins: [
        new HTMLWebpackPlugin({ template: './src/index.html' }),
        new CopyPlugin({
            patterns: [
                { from: path.resolve(__dirname, "src/img"),
                    to: path.resolve(__dirname, "dist/img"),
                    noErrorOnMissing: true
                },
            ],
        }),
        new MiniCssExtractPlugin({
            filename: filename("css"),
        })
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'src'),
            watch: true
        },
        compress: true,
        port: 3000,
        hot: isDev
    },
    devtool: 'inline-source-map',
}