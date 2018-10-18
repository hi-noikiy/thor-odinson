const path = require('path')
const tailwindcss = require('tailwindcss')

module.exports = {
  parser: 'postcss-scss',
  plugins: [
    tailwindcss(path.resolve(__dirname, "./tailwind.js")),
    // 'postcss-import': {},
    // 'postcss-preset-env': {},
    // 'cssnano': {}
  ]
}
