module.exports = {
  plugins: [
    require('postcss-preset-env')({
      // 启用 CSS 变量自动降级
      features: {
        'custom-properties': {
          preserve: false
        }
      }
    })
  ]
} 