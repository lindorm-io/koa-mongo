import { Middleware } from "@lindorm-io/koa";
import { MongoContext } from "../types";
import { MongoConnectionOptions, MongoConnection } from "@lindorm-io/mongo";

export const mongoMiddleware =
  (options: MongoConnectionOptions): Middleware<MongoContext> =>
  async (ctx, next): Promise<void> => {
    const metric = ctx.getMetric("mongo");

    ctx.client.mongo = new MongoConnection(options);

    await ctx.client.mongo.connect();

    ctx.logger.debug("mongo connection established");

    metric.end();

    try {
      await next();
    } finally {
      await ctx.client.mongo.disconnect();
    }
  };
