import { Middleware } from "@lindorm-io/koa";
import { MongoContext } from "../types";
import { MongoRepository } from "@lindorm-io/mongo";
import { camelCase } from "lodash";

interface Options {
  key?: string;
}

export const repositoryMiddleware =
  (Repository: typeof MongoRepository, options?: Options): Middleware<MongoContext> =>
  async (ctx, next): Promise<void> => {
    const metric = ctx.getMetric("mongo");

    /*
     * Ignoring TS here since Repository needs to be abstract
     * to ensure that all input at least attempts to be unique
     */
    // @ts-ignore
    ctx.repository[camelCase(options?.key || Repository.name)] = new Repository({
      db: await ctx.client.mongo.database(),
      logger: ctx.logger,
    });

    metric.end();

    await next();
  };
