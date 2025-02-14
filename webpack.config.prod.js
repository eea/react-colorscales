process.env.BABEL_ENV = "production";
process.env.NODE_ENV = "production";

const ESLintPlugin = require("eslint-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const autoprefixer = require("autoprefixer");
const eslintFormatter = require("react-dev-utils/eslintFormatter");
const paths = require("./config/paths");

const shouldUseSourceMap = false;

module.exports = {
  mode: "production",
  // Don't attempt to continue if there are any errors.
  bail: true,
  // Generate source maps
  devtool: shouldUseSourceMap ? "source-map" : false,
  entry: paths.appLibIndexJs,
  output: {
    path: paths.appBuild,
    filename: "index.js",
    libraryTarget: "umd",
  },
  resolve: {
    extensions: [".web.js", ".js", ".json", ".web.jsx", ".jsx"],
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        // "oneOf" will traverse all following loaders until one will
        // match the requirements. When no loader matches it will fall
        // back to the "file" loader at the end of the loader list.
        oneOf: [
          // {
          //   test: /\.cjs$/,
          //   type: "javascript/auto", // Allow Webpack to parse CommonJS properly
          // },
          // "url" loader works just like "file" loader but it also embeds
          // assets smaller than specified size as data URLs to avoid requests.
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
            loader: require.resolve("url-loader"),
            options: {
              limit: 10000,
              name: "[name].[ext]",
            },
          },
          // Process JS with Babel.
          {
            test: /\.(js|jsx)$/,
            include: paths.appLibSrc,
            loader: require.resolve("babel-loader"),
          },
          // The notation here is somewhat confusing.
          // "postcss" loader applies autoprefixer to our CSS.
          // "css" loader resolves paths in CSS and adds assets as dependencies.
          // "style" loader normally turns CSS into JS modules injecting <style>,
          // "sass-loader" compiles scss to css
          // but unlike in development configuration, we do something different.
          // `ExtractTextPlugin` first applies the "postcss" and "css" loaders
          // (second argument), then grabs the result CSS and puts it into a
          // separate file in our build process. This way we actually ship
          // a single CSS file in production instead of JS code injecting <style>
          // tags. If you use code splitting, however, any async bundles will still
          // use the "style" loader inside the async code so CSS from them won't be
          // in the main CSS file.
          {
            test: /\.(css|scss)$/,
            use: [
              "style-loader",
              "css-loader",
              {
                loader: require.resolve("postcss-loader"),
                options: {
                  postcssOptions: {
                    plugins: () => [
                      require("postcss-flexbugs-fixes"),
                      autoprefixer({
                        browsers: [
                          ">1%",
                          "last 4 versions",
                          "Firefox ESR",
                          "not ie < 9", // React doesn't support IE8 anyway
                        ],
                        flexbox: "no-2009",
                      }),
                    ],
                  },
                },
              },
            ],
          },
          // "file" loader makes sure assets end up in the `build` folder.
          // When you `import` an asset, you get its filename.
          // This loader don't uses a "test" so it will catch all modules
          // that fall through the other loaders.
          {
            loader: require.resolve("file-loader"),
            // Exclude `js` files to keep "css" loader working as it injects
            // it's runtime that would otherwise processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [/\.js$/, /\.html$/, /\.json$/, /\.cjs$/, /\.mjs$/],
            options: {
              name: "[name].[hash][ext]",
            },
          },
          // ** STOP ** Are you adding a new loader?
          // Make sure to add the new loader(s) before the "file" loader.
        ],
      },
    ],
  },
  plugins: [
    new ESLintPlugin({
      context: paths.appLibSrc,
      eslintPath: require.resolve("eslint"),
      formatter: eslintFormatter,
    }),
    new NodePolyfillPlugin(),
  ],
  externals: {
    react: "react",
    "react-dom": "react-dom",
  },
};
