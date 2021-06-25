import { ClientError } from "@lindorm-io/errors";
import { EntityBase } from "@lindorm-io/entity";
import { EntityNotFoundError, RepositoryBase } from "@lindorm-io/mongo";
import { Middleware } from "@lindorm-io/koa";
import { MongoContext } from "../types";
import { camelCase, get, isString } from "lodash";

interface MiddlewareOptions {
  entityKey?: string;
  repositoryKey?: string;
}

export interface RepositoryEntityMiddlewareOptions {
  optional?: boolean;
}

export const repositoryEntityMiddleware =
  (Entity: typeof EntityBase, Repository: typeof RepositoryBase, middlewareOptions: MiddlewareOptions = {}) =>
  (path: string, options: RepositoryEntityMiddlewareOptions = {}): Middleware<MongoContext> =>
  async (ctx, next): Promise<void> => {
    const metric = ctx.getMetric("entity");

    const id = get(ctx, path);

    if (!isString(id) && options.optional) {
      ctx.logger.debug("Optional entity identifier not found", { path });

      metric.end();

      return await next();
    }

    if (!isString(id)) {
      throw new ClientError("Invalid id", {
        debug: { path, id },
        description: "Entity id expected",
        statusCode: ClientError.StatusCode.BAD_REQUEST,
      });
    }

    const entity = middlewareOptions.entityKey || camelCase(Entity.name);
    const repository = middlewareOptions.repositoryKey || camelCase(Repository.name);

    try {
      ctx.entity[entity] = await ctx.repository[repository].find({ id });
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new ClientError(`Invalid ${Entity.name}`, {
          debug: { id },
          error: err,
          statusCode: ClientError.StatusCode.BAD_REQUEST,
        });
      }

      metric.end();

      throw err;
    }

    metric.end();

    await next();
  };
