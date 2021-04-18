import { IKoaMongoContext } from "../types";
import { Middleware, Next } from "koa";
import { MongoRepository } from "@lindorm-io/mongo";
import { camelCase } from "lodash";

interface RepositoryMiddlewareOptions {
  key?: string;
}

export const repositoryMiddleware = (
  Repository: typeof MongoRepository,
  options?: RepositoryMiddlewareOptions,
): Middleware => async (ctx: IKoaMongoContext, next: Next): Promise<void> => {
  const start = Date.now();

  /*
   * Ignoring TS here since Repository needs to be abstract
   * to ensure that all input at least attempts to be unique
   */
  // @ts-ignore
  ctx.repository[camelCase(options?.key || Repository.name)] = new Repository({
    db: await ctx.client.mongo.database(),
    logger: ctx.logger,
  });

  ctx.metrics.repository = (ctx.metrics.repository || 0) + (Date.now() - start);

  await next();
};
