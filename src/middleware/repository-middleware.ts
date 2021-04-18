import { IKoaMongoContext } from "../types";
import { Middleware, Next } from "koa";
import { RepositoryBase } from "@lindorm-io/mongo";
import { camelCase } from "lodash";

interface RepositoryMiddlewareOptions {
  key?: string;
}

export const repositoryMiddleware = (
  Repository: typeof RepositoryBase,
  options?: RepositoryMiddlewareOptions,
): Middleware => async (ctx: IKoaMongoContext, next: Next): Promise<void> => {
  const start = Date.now();

  const db = await ctx.mongo.getDatabase();
  const logger = ctx.logger;

  /*
   * Ignoring TS here since Repository needs to be abstract
   * to ensure that all input at least attempts to be unique
   */
  // @ts-ignore
  ctx.repository[camelCase(options?.key || Repository.name)] = new Repository({ db, logger });

  ctx.metrics.repository = (ctx.metrics.repository || 0) + (Date.now() - start);

  await next();
};
