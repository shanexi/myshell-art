import { z } from 'zod';

export const rollupTransparentSchema = z.object({
  externals: z.array(z.string()).default([]),
  bundleAlias: z
    .record(z.string(), z.string())
    .default({})
    .describe(
      '针对性的对依赖进行一些 bundle, 避开默认的会 externalize 指定的 externals, dependencies, peerDepencies',
    ),
  bundleSuppressWarnCodes: z
    .array(z.string())
    .default([])
    .describe('e.g. ["UNUSED_EXTERNAL_IMPORT"]'),
  banner: z.string().optional(),
});

export const buildRollupConfigInputSchema = rollupTransparentSchema.extend({
  dtsBundleInput: z.string().describe('e.g. outputPath + "src/index.d.ts"'),
  dtsBundleFile: z.string().describe('e.g. outputPath + "index.bundle.d.ts"'),
  bundleInput: z.string().describe('e.g. outputPath + "src/index.js"'),
  bundleFile: z.string().describe('e.g. outputPath + "index.bundle.js"'),
  packageJsonPath: z.string().describe('e.g. outputPath + "package.json"'),
});

export const localPublishExecutorSchema = rollupTransparentSchema.extend({
  outputPath: z.string().describe('e.g. "dist/libs/my-lib"'),
  tsConfig: z
    .string()
    .optional()
    .describe('e.g. 如果 folder 和 project name 不一致，可指定'),
  watch: z.boolean().default(false),
  yalc: z.boolean().default(true),
  assets: z.array(z.any()).default([]).describe('tscExecutor#assets'),
});
