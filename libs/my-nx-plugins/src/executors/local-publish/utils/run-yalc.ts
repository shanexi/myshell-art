import { z } from 'zod';
import { localPublishExecutorSchema } from '../zod-schema';
import { ExecutorContext } from '@nrwl/devkit';
import consola from 'consola';
import * as path from 'path';
import * as fs from 'fs-extra';
import { execSync } from 'child_process';

export const runYalc = (
  options: z.infer<typeof localPublishExecutorSchema>,
  context: ExecutorContext,
) => {
  consola.start(`yalc publish ${context.projectName} ...`);

  fs.writeFileSync(path.join(options.outputPath, '.yalcignore'), `src/**/*`);
  if (options.watch) {
    execSync(`yalc publish --push --changed`, {
      cwd: options.outputPath,
      stdio: 'inherit',
    });
  } else {
    execSync(`yalc publish --push`, {
      cwd: options.outputPath,
      stdio: 'inherit',
    });
  }
  consola.success('yalc publish done.');
};
