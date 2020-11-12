import { IMongoMiddlewareContext, IMongoMiddlewareOptions } from "../types";
import { MongoConnection, MongoConnectionType } from "@lindorm-io/mongo";
import { TPromise } from "@lindorm-io/core";

export const mongoMiddleware = (options: IMongoMiddlewareOptions) => async (
  ctx: IMongoMiddlewareContext,
  next: TPromise<void>,
): Promise<void> => {
  const start = Date.now();

  ctx.mongo = new MongoConnection(options);

  await ctx.mongo.connect();

  if (options.type === MongoConnectionType.MEMORY && options.databaseRef) {
    options.databaseRef(ctx.mongo.getDatabase());
    ctx.logger.debug("mongo database ref called");
  }

  ctx.logger.debug("mongo connection established");

  ctx.metrics = {
    ...(ctx.metrics || {}),
    mongoConnection: Date.now() - start,
  };

  try {
    await next();
  } finally {
    if (options.type !== MongoConnectionType.MEMORY) {
      await ctx.mongo.disconnect();
    }
  }
};
