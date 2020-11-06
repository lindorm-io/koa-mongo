import { MongoInMemoryConnection } from "@lindorm-io/mongo";
import { IMongoMiddlewareContext } from "../types";
import { TPromise } from "@lindorm-io/core";

export const mongoInMemoryMiddleware = (mongo: MongoInMemoryConnection) => async (
  ctx: IMongoMiddlewareContext,
  next: TPromise<void>,
): Promise<void> => {
  const start = Date.now();

  ctx.mongo = mongo;

  ctx.logger.debug("mongo in memory connection established");

  ctx.metrics = {
    ...(ctx.metrics || {}),
    mongoInMemoryConnection: Date.now() - start,
  };

  try {
    await next();
  } finally {
    await ctx.mongo.disconnect();
  }
};
