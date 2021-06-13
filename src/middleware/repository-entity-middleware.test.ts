import { Metric, Middleware } from "@lindorm-io/koa";
import { logger } from "../test";
import { repositoryEntityMiddleware } from "./repository-entity-middleware";
import { EntityNotFoundError } from "@lindorm-io/mongo";
import { ClientError } from "@lindorm-io/errors";

class TestEntity {}
class TestRepository {}

const next = () => Promise.resolve();

describe("repositoryEntityMiddleware", () => {
  let ctx: any;
  let middleware: Middleware<any>;

  beforeEach(() => {
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

    // @ts-ignore
    middleware = repositoryEntityMiddleware("request.body.identifier", TestEntity, TestRepository);
  });

  test("should set entity on context", async () => {
    await expect(middleware(ctx, next)).resolves.toBeUndefined();

    expect(ctx.entity.testEntity).toStrictEqual(expect.any(TestEntity));
    expect(ctx.metrics.entity).toStrictEqual(expect.any(Number));
  });

  test("should find repository on context with options key", async () => {
    // @ts-ignore
    middleware = repositoryEntityMiddleware("request.body.identifier", TestEntity, TestRepository, {
      repositoryKey: "repositoryKey",
    });

    ctx.repository.repositoryKey = { find: async () => new TestEntity() };

    await expect(middleware(ctx, next)).resolves.toBeUndefined();

    expect(ctx.entity.testEntity).toStrictEqual(expect.any(TestEntity));
  });

  test("should set entity on context with options key", async () => {
    // @ts-ignore
    middleware = repositoryEntityMiddleware("request.body.identifier", TestEntity, TestRepository, {
      entityKey: "entityKey",
    });

    await expect(middleware(ctx, next)).resolves.toBeUndefined();

    expect(ctx.entity.entityKey).toStrictEqual(expect.any(TestEntity));
  });

  test("should succeed when identifier is optional", async () => {
    // @ts-ignore
    middleware = repositoryEntityMiddleware("request.body.identifier", TestEntity, TestRepository, {
      optional: true,
    });

    ctx.request.body.identifier = undefined;

    await expect(middleware(ctx, next)).resolves.toBeUndefined();

    expect(ctx.entity.testEntity).toBeUndefined();
  });

  test("should throw ClientError when identifier is missing", async () => {
    ctx.request.body.identifier = undefined;

    await expect(middleware(ctx, next)).rejects.toThrow(ClientError);
  });

  test("should throw ClientError when entity is missing", async () => {
    ctx.repository.testRepository.find.mockRejectedValue(new EntityNotFoundError("message"));

    await expect(middleware(ctx, next)).rejects.toThrow(ClientError);
  });
});
