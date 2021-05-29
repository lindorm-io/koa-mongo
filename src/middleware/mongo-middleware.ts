import { DefaultState, Middleware } from "koa";
import { IKoaMongoContext } from "../types";
import { IMongoConnectionOptions, MongoConnection } from "@lindorm-io/mongo";

export const mongoMiddleware =
  (options: IMongoConnectionOptions): Middleware<DefaultState, IKoaMongoContext> =>
  async (ctx, next): Promise<void> => {
    const start = Date.now();

    ctx.client.mongo = new MongoConnection(options);

    await ctx.client.mongo.connect();

    ctx.logger.debug("mongo connection established");

    ctx.metrics.mongo = (ctx.metrics.mongo || 0) + (Date.now() - start);

    try {
      await next();
    } finally {
      await ctx.client.mongo.disconnect();
    }
  };
