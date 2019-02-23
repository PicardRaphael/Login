const webpack = require('webpack');
const path = require('path');

// Plugins de traitement pour dist/
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

// Config pour le devServer
const host = 'localhost';
const port = 3000;

const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: 'development',

  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    alias: {
      p3demos: path.join(__dirname, 'src'),
      node_modules: path.join(__dirname, 'node_modules'),
    },
    plugins: [
      new TsconfigPathsPlugin({
        baseUrl: __dirname,
        extensions: [ '.tsx', '.ts', '.js' ],
      })
    ]
  },

  entry: {
    demos: './src/index.tsx',
  },

  output: {
    // Nom du bundle
    // filename: '[name].bundle_[chunkhash].js', // in prod
    filename: '[name].bundle.js',
    // Nom du bundle vendors si l'option d'optimisation / splitChunks est activée
    chunkFilename: '[name].vendors.js',
    // Cible des bundles (dossier parent de wrapper/ aka. racine du projet)
    // path: path.resolve(__dirname, 'dist/demos'),
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  }, 

  devtool: 'inline-source-map',

  optimization: {
    // Code spliting (vendors)
    splitChunks: {
      chunks: 'all',
    },
    // Minification
    // minimizer: [
    //   new UglifyJsPlugin({
    //     cache: true,
    //     parallel: true,
    //     uglifyOptions: {
    //       mangle: false
    //       // mangle: {
    //       //   toplevel: true,
    //       //   reserved: [
    //       //     'React',
    //       //     'Phaser'
    //       //   ]
    //       // }
    //     },
    //     sourceMap: false // passer à true pour JS source maps
    //   }),
    //   new OptimizeCSSAssetsPlugin({})
    // ]
  },

  module: {
    rules: [
      // HTML
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
        }
      },

      // TypeScript
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules\/(?!phaser-webpack-loader)/
      },

      // Source map
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre"
      },

      // CSS / SASS / SCSS
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          // style-loader ou fichier
          devMode ? 'style-loader' :
            MiniCssExtractPlugin.loader,
          // Chargement du CSS
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('autoprefixer')],
              sourceMap: true,
            },
          },
          // SASS
          'sass-loader',
        ],
      },

      // Images
      {
        test: /\.(png|svg|jpe?g|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]?[hash]'
            },
          },
        ],
      },

      // Markdown (processed by Showdown)
      {
        test: /\.(md)$/,
        use: {
          loader: 'raw-loader',
        }
      },
    ]
  },

  devServer: {
    overlay: true, // Overlay navigateur si erreurs de build
    stats: 'minimal', // Infos en console limitées
    progress: true, // progression du build en console
    inline: true, // Rechargement du navigateur en cas de changement
    open: true, // on ouvre le navigateur
    historyApiFallback: true,
    host: host,
    port: port,
  },

  plugins: [
    new webpack.ProvidePlugin({
      Phaser: 'phaser'
    }),

    // Permet de prendre le index.html de src comme base pour le fichier de dist/
    new HtmlWebPackPlugin({
      template: 'src/index.html',
      // chunks: ['vendors~demos', 'demos']
      // @see https://github.com/jantimon/html-webpack-plugin/issues/968
      // Fixed with html-webpack-plugin@next:
      chunks: ['demos']
    }),
    
    // Permet d'exporter les styles CSS dans un fichier css de dist/
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
};