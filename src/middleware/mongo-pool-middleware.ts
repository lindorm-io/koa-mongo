import { Middleware } from "@lindorm-io/koa";
import { MongoConnection } from "@lindorm-io/mongo";
import { MongoContext } from "../types";

export const mongoPoolMiddleware =
  (mongo: MongoConnection): Middleware<MongoContext> =>
  async (ctx, next): Promise<void> => {
    const metric = ctx.getMetric("mongo");

    if (!mongo.isConnected()) {
      await mongo.connect();
    }

    ctx.client.mongo = mongo;

    ctx.logger.debug("mongo connection added to context");

    metric.end();

    await next();
  };
