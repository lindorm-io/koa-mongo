import { ClientError } from "@lindorm-io/errors";
import { EntityNotFoundError } from "@lindorm-io/mongo";
import { Metric } from "@lindorm-io/koa";
import { logger } from "../test";
import { repositoryEntityMiddleware } from "./repository-entity-middleware";

class TestEntity {}
class TestRepository {}

const next = () => Promise.resolve();

describe("repositoryEntityMiddleware", () => {
  let middlewareOptions: any;
  let options: any;
  let ctx: any;
  let path: string;

  beforeEach(() => {
    middlewareOptions = {};
    options = {};
    ctx = {
      entity: {},
      logger,
      metrics: {},
      repository: {
        testRepository: {
          find: jest.fn().mockResolvedValue(new TestEntity()),
        },
      },
      request: { body: { identifier: "identifier" } },
    };
    ctx.getMetric = (key: string) => new Metric(ctx, key);

    path = "request.body.identifier";
  });

  test("should set entity on context", async () => {
    // @ts-ignore
    await expect(
      // @ts-ignore
      repositoryEntityMiddleware(TestEntity, TestRepository, middlewareOptions)(path, options)(ctx, next),
    ).resolves.toBeUndefined();

    expect(ctx.entity.testEntity).toStrictEqual(expect.any(TestEntity));
    expect(ctx.metrics.entity).toStrictEqual(expect.any(Number));
  });

  test("should find repository on context with options key", async () => {
    middlewareOptions.repositoryKey = "repositoryKey";

    ctx.repository.repositoryKey = { find: async () => new TestEntity() };

    await expect(
      // @ts-ignore
      repositoryEntityMiddleware(TestEntity, TestRepository, middlewareOptions)(path, options)(ctx, next),
    ).resolves.toBeUndefined();

    expect(ctx.entity.testEntity).toStrictEqual(expect.any(TestEntity));
  });

  test("should set entity on context with options key", async () => {
    middlewareOptions.entityKey = "entityKey";

    await expect(
      // @ts-ignore
      repositoryEntityMiddleware(TestEntity, TestRepository, middlewareOptions)(path, options)(ctx, next),
    ).resolves.toBeUndefined();

    expect(ctx.entity.entityKey).toStrictEqual(expect.any(TestEntity));
  });

  test("should succeed when identifier is optional", async () => {
    options.optional = true;
    ctx.request.body.identifier = undefined;

    await expect(
      // @ts-ignore
      repositoryEntityMiddleware(TestEntity, TestRepository, middlewareOptions)(path, options)(ctx, next),
    ).resolves.toBeUndefined();

    expect(ctx.entity.testEntity).toBeUndefined();
  });

  test("should throw ClientError when identifier is missing", async () => {
    ctx.request.body.identifier = undefined;

    await expect(
      // @ts-ignore
      repositoryEntityMiddleware(TestEntity, TestRepository, middlewareOptions)(path, options)(ctx, next),
    ).rejects.toThrow(ClientError);
  });

  test("should throw ClientError when entity is missing", async () => {
    ctx.repository.testRepository.find.mockRejectedValue(new EntityNotFoundError("message"));

    await expect(
      // @ts-ignore
      repositoryEntityMiddleware(TestEntity, TestRepository, middlewareOptions)(path, options)(ctx, next),
    ).rejects.toThrow(ClientError);
  });
});
