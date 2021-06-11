import { repositoryMiddleware } from "./repository-middleware";
import { logger } from "../test";
import { Metric } from "@lindorm-io/koa";

class Test {}

const next = () => Promise.resolve();

describe("repositoryMiddleware", () => {
  let ctx: any;

  beforeEach(() => {
    ctx = {
      client: { mongo: { database: () => "db" } },
      logger,
      metrics: {},
      repository: {},
    };
    ctx.getMetric = (key: string) => new Metric(ctx, key);
  });

  test("should set repository on context", async () => {
    // @ts-ignore
    await expect(repositoryMiddleware(Test)(ctx, next)).resolves.toBeUndefined();
    expect(ctx.repository.test).toStrictEqual(expect.any(Test));
    expect(ctx.metrics.mongo).toStrictEqual(expect.any(Number));
  });

  test("should set repository with specific key", async () => {
    // @ts-ignore
    await expect(repositoryMiddleware(Test, { key: "otherKey" })(ctx, next)).resolves.toBeUndefined();
    expect(ctx.repository.otherKey).toStrictEqual(expect.any(Test));
    expect(ctx.metrics.mongo).toStrictEqual(expect.any(Number));
  });
});
