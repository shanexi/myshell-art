import { localPublishExecutorSchema } from './zod-schema';

export type LocalPublishExecutorSchema = z.infer<
  typeof localPublishExecutorSchema
>;
