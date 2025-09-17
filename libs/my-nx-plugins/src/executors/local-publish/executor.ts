import { type ExecutorContext } from '@nrwl/devkit';
import { tscExecutor } from '@nrwl/js/src/executors/tsc/tsc.impl';
import consola from 'consola';
import * as rollup from 'rollup';
import { z } from 'zod';
import { buildRollupConfig } from './utils/build-rollup-config';
import { makeRollupConfig } from './utils/make-rollup-config';
import { runUpdatePackageJson } from './utils/run-update-packagejson';
import { runYalc } from './utils/run-yalc';
import { localPublishExecutorSchema } from './zod-schema';

export default async function* runExecutor(
  _options: z.infer<typeof localPublishExecutorSchema>,
  context?: ExecutorContext,
) {
  const options = localPublishExecutorSchema.parse(_options);
  consola.info('Executor ran for `Local Publish`');
  // console.log(options);

  const tscGenerator = tscExecutor(
    {
      buildableProjectDepsInPackageJsonType: 'peerDependencies',
      generateLockfile: false,
      outputPath: options.outputPath,
      main: `libs/${context.projectName}/src/index.ts`,
      tsConfig:
        options.tsConfig || `libs/${context.projectName}/tsconfig.lib.json`,
      assets: options.assets,
      watch: options.watch,
      clean: true,
      transformers: [],
      updateBuildableProjectDepsInPackageJson: true,
      externalBuildTargets: ['build'],
    },
    {
      ...context,
      targetName: 'build', // fix: isBuildable 会检查 deps 是否存在相同 target, 位置：checkDependencies > calculateProjectDependencies
    },
  );

  for await (const output of tscGenerator) {
    yield output;

    const rollupOptions = buildRollupConfig(makeRollupConfig(options, context));
    try {
      for (const rollupOption of rollupOptions) {
        consola.start(
          `Bundling [${context.projectName}] ${rollupOption.input}...`,
        );
        const bundle = await rollup.rollup(rollupOption);
        if (Array.isArray(rollupOption.output)) {
          for (const output of rollupOption.output) {
            await bundle.write(output);
          }
        } else {
          await bundle.write(rollupOption.output);
        }
        consola.success(`Bundled`);
      }

      runUpdatePackageJson(options);

      if (options.yalc) {
        runYalc(options, context);
      }

      return {
        success: true,
      };
    } catch (e) {
      if (e instanceof Error) {
        consola.error(`Bundle error ${e.message}`);
      } else {
        console.error(e);
      }

      return {
        success: false,
      };
    }
  }
}
