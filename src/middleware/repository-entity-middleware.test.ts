import { ClientError } from "@lindorm-io/errors";
import { EntityNotFoundError } from "@lindorm-io/mongo";
import { Metric } from "@lindorm-io/koa";
import { logger } from "../test";
import { repositoryEntityMiddleware } from "./repository-entity-middleware";

class TestEntity {}
class TestRepository {}

const next = () => Promise.resolve();

describe("repositoryEntityMiddleware", () => {
  let ctx: any;
  let path: string;
  let middleware: any;

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

    path = "request.body.identifier";

    // @ts-ignore
    middleware = repositoryEntityMiddleware(TestEntity, TestRepository)(path);
  });

  test("should set entity on context", async () => {
    // @ts-ignore
    await expect(middleware(ctx, next)).resolves.toBeUndefined();

    expect(ctx.entity.testEntity).toStrictEqual(expect.any(TestEntity));
    expect(ctx.metrics.entity).toStrictEqual(expect.any(Number));
  });

  test("should find repository on context with options key", async () => {
    // @ts-ignore
    middleware = repositoryEntityMiddleware(TestEntity, TestRepository, {
      repositoryKey: "repositoryKey",
    })(path);

    ctx.repository.repositoryKey = { find: async () => new TestEntity() };

    await expect(middleware(ctx, next)).resolves.toBeUndefined();

    expect(ctx.entity.testEntity).toStrictEqual(expect.any(TestEntity));
  });

  test("should set entity on context with options key", async () => {
    // @ts-ignore
    middleware = repositoryEntityMiddleware(TestEntity, TestRepository, {
      entityKey: "entityKey",
    })(path);

    await expect(middleware(ctx, next)).resolves.toBeUndefined();

    expect(ctx.entity.entityKey).toStrictEqual(expect.any(TestEntity));
  });

  test("should succeed when identifier is optional", async () => {
    // @ts-ignore
    middleware = repositoryEntityMiddleware(TestEntity, TestRepository, {
      optional: true,
    })(path);

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
