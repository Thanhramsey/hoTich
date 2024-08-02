module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/hoTich/'
    : '/',
    devServer: {
      proxy: 'https://congdichvu.gialai.gov.vn',
    },
};
