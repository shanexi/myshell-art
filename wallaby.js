module.exports = function (wallaby) {
  return {
    // Tell Wallaby to only try configuring with vitest
    // Default is: ['angular', 'jest', 'vitest']
    autoDetect: ['jest'],

    // Limit how many processes Wallaby will use, for example:
    // 1 process for incremental runs, 2 processes at startup
    workers: { regular: 1, initial: 2 },

    // modify `files` automatic configuration settings
    files: {
      override: (filePatterns) => {
        // TODO: modify `filePatterns` array as required
        // return filePatterns;
        return [
          'libs/**/src/**/*.ts',
          '!libs/**/src/**/*.spec.ts',

          'libs/**/src/**/*.tsx',
          '!libs/**/src/**/*.spec.tsx',
        ];
      },
    },

    // modify `tests` automatic configuration settings
    tests: {
      override: (testPatterns) => {
        // TODO: modify `testPatterns` array as required
        // return testPatterns;
        return ['libs/**/src/**/*.spec.ts', 'libs/**/src/**/*.spec.tsx'];
      },
    },
  };
};
