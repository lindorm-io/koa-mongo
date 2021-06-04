import { Middleware } from "@lindorm-io/koa";
import { MongoConnection } from "@lindorm-io/mongo";
import { MongoContext } from "../types";

export const mongoPoolMiddleware =
  (mongo: MongoConnection): Middleware<MongoContext> =>
  async (ctx, next): Promise<void> => {
    const start = Date.now();

    if (!mongo.isConnected()) {
      await mongo.connect();
    }

    ctx.client.mongo = mongo;

    ctx.logger.debug("mongo connection added to context");

    ctx.metrics.mongo = (ctx.metrics.mongo || 0) + (Date.now() - start);

    await next();
  };
