import WebpackBar from 'webpackbar'

module.exports = {
  webpack: (config, { dev }) => {
    if (dev) {
      config.devtool = 'cheap-module-source-map'
    }
    console.info(config.cache)
    config.mode = 'development'
    config.plugins.push(
      new WebpackBar({
        fancy: true,
        profile: true,
        basic: false,
      })
    )
    return config
  },
}
