const path = require('path');

const cssCfg = {
  test: /\.css$/,
  include: path.resolve(__dirname, '../src'),
  use: [
    require.resolve('style-loader'),
    require.resolve('css-loader'),
    {
      loader: require.resolve('postcss-loader'),
      options: {
        postcssOptions: {
          config: path.resolve(
            __dirname,
            '../libs/tailwind-cfg/postcss.config.js',
          ),
        },
      },
    },
  ],
};

function makeConfig() {
  return {
    core: {
      disableTelemetry: true,
    },
    framework: {
      name: '@storybook/react-webpack5',
      options: {},
    },
    stories: [
      // TODO 等 libs 新建项目后打开注释并调整
      // {
      //   directory: '../libs/agent/ui/src',
      //   files: '**/*.stories.@(js|jsx|ts|tsx)',
      //   titlePrefix: 'agent-ui',
      // },
    ],
    addons: [
      '@storybook/addon-essentials',
      '@storybook/addon-interactions',
      '@nrwl/react/plugins/storybook',
      '@storybook/addon-designs',
    ],
    // https://storybook.js.org/docs/api/main-config-typescript#skipbabel
    // typescript: {
    //   check: false,
    //   reactDocgen: false,
    // },
    webpackFinal: async (config, { configType }) => {
      // Make whatever fine-grained changes you need that should apply to all storybook configs
      // Return the altered config
      config.module.rules.forEach((rule) => {
        if (rule.test && rule.test.toString) {
          if (
            rule.test.toString() ===
            '/\\.css$|\\.scss$|\\.sass$|\\.less$|\\.styl$/'
          ) {
            rule.oneOf.unshift(cssCfg);
            console.log('[custom] tailwindcss config added');
          }
          return (
            rule.test.toString() ===
            '/\\.css$|\\.scss$|\\.sass$|\\.less$|\\.styl$/'
          );
        }
        return false;
      });

      config.module.rules.push({
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      });

      // https://github.com/inversify/InversifyJS/issues/1408#issuecomment-1030090826
      config.ignoreWarnings = [/Failed to parse source map/];
      return config;
    },
  };
}

module.exports = makeConfig();

// To customize your webpack configuration you can use the webpackFinal field.
// Check https://storybook.js.org/docs/react/builders/webpack#extending-storybooks-webpack-config
// and https://nx.dev/packages/storybook/documents/custom-builder-configs
