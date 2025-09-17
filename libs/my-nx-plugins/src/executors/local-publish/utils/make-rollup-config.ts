import { z } from 'zod';
import { localPublishExecutorSchema } from '../zod-schema';
import * as path from 'path';
import * as _ from 'radash';
import { ExecutorContext } from '@nrwl/devkit';

export const makeRollupConfig = (
  options: z.infer<typeof localPublishExecutorSchema>,
  context: ExecutorContext,
) => {
  const opts = {
    // buildRollupConfigInputSchema 部分
    dtsBundleInput: path.join(options.outputPath, `src/index.d.ts`),
    dtsBundleFile: path.join(options.outputPath, `index.bundle.d.ts`),
    packageJsonPath: path.join(options.outputPath, `package.json`),
    bundleInput: path.join(options.outputPath, `src/index.js`),
    bundleFile: path.join(options.outputPath, `index.bundle.js`),

    // rollupTransparentSchema 透传部分
    bundleAlias: _.mapValues(options.bundleAlias, (value) =>
      path.join(context.root, value),
    ),
    bundleSuppressWarnCodes: options.bundleSuppressWarnCodes,
    externals: options.externals,
    banner: options.banner,
  };

  return opts;
};
