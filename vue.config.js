module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/hoTich/'
    : '/',
  devServer: {
    proxy: {
      '/api': {
        target: 'https://congdichvu.gialai.gov.vn',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    }
  }
};
