#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');
const { argv } = require('process');

const options = {
  // todo nx affected in not pr
  ci: argv.includes('--ci'), // ci need extra prepare steps, e.g. pnpm i, cypress install
  pr: argv.includes('--pr'), // pr will skip nx jest, while run jest in root
  reset: argv.includes('--reset'), // list seperately for convenience,
  yalc: argv.includes('--yalc'), // list seperately for convenience
};

function run(tag, cmd) {
  console.log('\x1b[33m%s\x1b[0m', `${tag}...`);
  console.time(tag);
  execSync(cmd, {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
  });
  console.timeEnd(tag);
  console.log('\x1b[32m%s\x1b[0m', 'done');
}

if (options.ci) {
  run('pnpm', 'pnpm dlx pnpm@7.33.7 i --frozen-lockfile --ignore-scripts');
  run(
    'yalc',
    'find ./node_modules/.pnpm -type d -name "file+.yalc+*" -print -exec rm -r {} +',
  );
  run(
    'pnpm again',
    'pnpm dlx pnpm@7.33.7 i --frozen-lockfile --ignore-scripts',
  );
}

if (!options.ci && options.yalc) {
  run(
    'yalc',
    'find ./node_modules/.pnpm -type d -name "file+.yalc+*" -print -exec rm -r {} +',
  );
  run(
    'pnpm again',
    'pnpm dlx pnpm@7.33.7 i --frozen-lockfile --ignore-scripts',
  );
}

if (!options.ci && options.reset) {
  run('reset', './node_modules/.bin/nx reset');
}

if (!options.pr) {
  run('lint', './node_modules/.bin/nx run-many --target lint');
  run('build', './node_modules/.bin/nx run-many --target build');
  run(
    'test',
    './node_modules/.bin/nx run-many --target test --output-style=static',
  );
} else {
  // run test use ArtiomTr/jest-coverage-report-action@v2
  run('cypress', './node_modules/.bin/cypress install');
  run('playwright', './node_modules/.bin/playwright install chromium');
  run('e2e', './node_modules/.bin/nx run-many --target e2e');
  // execSync('node ./scripts/test-storybook.js', {
  //   cwd: path.join(__dirname, '..'),
  //   stdio: 'inherit',
  // });
}
