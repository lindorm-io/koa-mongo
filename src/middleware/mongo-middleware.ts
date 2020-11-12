import { IMongoConnectionOptions, MongoConnection, TMongoDatabase } from "@lindorm-io/mongo";
import { IMongoMiddlewareContext } from "../types";
import { TPromise } from "@lindorm-io/core";

export interface IMongoMiddlewareOptions extends IMongoConnectionOptions {
  databaseRef?: (database: TMongoDatabase) => void;
}

export const mongoMiddleware = (options: IMongoMiddlewareOptions) => async (
  ctx: IMongoMiddlewareContext,
  next: TPromise<void>,
): Promise<void> => {
  const start = Date.now();

  ctx.mongo = new MongoConnection(options);

  await ctx.mongo.connect();

  if (options.databaseRef) {
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
    await ctx.mongo.disconnect();
  }
};
