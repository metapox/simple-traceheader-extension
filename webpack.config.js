const path = require('path');

module.exports = {
  entry: {
    background: './src/background.js',
    popup: './src/popup.js',
    options: './src/options.js',
  },
  output: {
    filename: '[name].js', // 出力ファイル名
    path: path.resolve(__dirname), // 出力ディレクトリ
  },
};
