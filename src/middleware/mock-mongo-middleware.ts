import { IKoaAppContext } from "@lindorm-io/koa";
import { IMongoConnectionOptions, MongoInMemoryConnection } from "@lindorm-io/mongo";
import { TPromise } from "@lindorm-io/core";

export interface IMongoMiddlewareContext extends IKoaAppContext {
  mongo: MongoInMemoryConnection;
}

export const mongoInMemoryMiddleware = (options: IMongoConnectionOptions) => async (
  ctx: IMongoMiddlewareContext,
  next: TPromise<void>,
): Promise<void> => {
  const start = Date.now();

  ctx.mongo = new MongoInMemoryConnection(options);

  await ctx.mongo.connect();

  ctx.logger.debug("mongo connection established");

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
