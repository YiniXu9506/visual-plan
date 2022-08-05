module.exports = {
  core: {
    builder: 'webpack5',
  },
  stories: [
    './stories/**/*.stories.mdx',
    './stories/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: '@storybook/react',
  webpackFinal: async config => {
    const cssModel = config.module.rules.find(
      i => i.test.toString() === '/\\.css$/'
    )
    let lessRule = {
      test: /\.less$/,
      sideEffects: true,
      use: [
        ...cssModel.use,
        {
          loader: 'less-loader',
          options: {
            lessOptions: {
              javascriptEnabled: true,
            },
          },
        },
      ],
    }
    config.module.rules.push(lessRule)
    return config
  },
}
