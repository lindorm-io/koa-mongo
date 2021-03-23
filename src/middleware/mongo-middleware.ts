import { IMongoConnectionOptions, MongoConnection } from "@lindorm-io/mongo";
import { IMongoMiddlewareContext, TNext } from "../types";

export const mongoMiddleware = (options: IMongoConnectionOptions) => async (
  ctx: IMongoMiddlewareContext,
  next: TNext,
): Promise<void> => {
  const start = Date.now();

  ctx.mongo = new MongoConnection(options);

  await ctx.mongo.connect();

  ctx.logger.debug("mongo connection established");

  ctx.metrics = {
    ...(ctx.metrics || {}),
    mongoConnection: Date.now() - start,
  };

  try {
    await next();
  } finally {
    await ctx.mongo.disconnect();
  }
};
