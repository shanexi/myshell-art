const nxPreset = require('@nrwl/jest/preset').default;

module.exports = {
  ...nxPreset,
  prettierPath: require.resolve('prettier-2'),
};
