import { readJsonFile, writeJsonFile } from '@nrwl/devkit';
import consola from 'consola';
import * as path from 'path';
import { z } from 'zod';
import { localPublishExecutorSchema } from '../zod-schema';

export const runUpdatePackageJson = (
  options: z.infer<typeof localPublishExecutorSchema>,
) => {
  consola.start('Updating package.json');
  const packageJsonPath = path.join(options.outputPath, 'package.json');
  const packageJson = readJsonFile(packageJsonPath);

  // FIXME 很奇怪 tscGenerator 将 types 改掉了 需要恢复 否则 ^build 会报错
  // 先手动改下
  delete packageJson.main;
  packageJson.types = './src/index.d.ts';

  packageJson.exports = {
    ...packageJson.exports,
    '.': {
      types: './index.bundle.d.ts',
      default: './index.bundle.js',
    },
    './package.json': {
      default: './package.json',
    },
  };

  // 即已经 bundle 不需要再依赖安装
  if (Object.keys(options.bundleAlias).length > 0) {
    Object.keys(options.bundleAlias).forEach((k) => {
      delete packageJson.dependencies[k];
      delete packageJson.peerDependencies[k];
    });
    consola.info(
      '  to delete bundleAlias in package.json#{peerDependencies,dependencies}',
    );
  }
  writeJsonFile(`${options.outputPath}/package.json`, packageJson);
  consola.success('Updated package.json');
};
