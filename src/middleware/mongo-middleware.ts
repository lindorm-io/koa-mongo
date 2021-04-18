import { IKoaMongoContext } from "../types";
import { IMongoConnectionOptions, MongoConnection } from "@lindorm-io/mongo";
import { Middleware, Next } from "koa";

export const mongoMiddleware = (options: IMongoConnectionOptions): Middleware => async (
  ctx: IKoaMongoContext,
  next: Next,
): Promise<void> => {
  const start = Date.now();

  ctx.mongo = new MongoConnection(options);

  await ctx.mongo.connect();

  ctx.logger.debug("mongo connection established");

  ctx.metrics.mongo = (ctx.metrics.mongo || 0) + (Date.now() - start);

  try {
    await next();
  } finally {
    await ctx.mongo.disconnect();
  }
};
