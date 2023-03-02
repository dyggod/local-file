
module.exports = {
  outputDir: '../public/dist',
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
};
