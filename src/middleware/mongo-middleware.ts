import { Context } from "koa";
import { IMongoConnectionOptions, MongoConnection } from "@lindorm-io/mongo";
import { Logger } from "@lindorm-io/winston";
import { TObject, TPromise } from "@lindorm-io/global";

export interface IMongoMiddlewareContext extends Context {
  logger: Logger;
  metrics: TObject<number>;
  mongo: MongoConnection;
}

export const mongoMiddleware = (options: IMongoConnectionOptions) => async (
  ctx: IMongoMiddlewareContext,
  next: TPromise<void>,
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
