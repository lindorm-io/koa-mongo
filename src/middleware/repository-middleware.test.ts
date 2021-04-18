import { repositoryMiddleware } from "./repository-middleware";
import { logger } from "../test";

class Test {}

describe("repositoryMiddleware", () => {
  let ctx: any;
  let next: any;

  beforeEach(() => {
    ctx = {
      client: { mongo: { database: () => "db" } },
      logger,
      metrics: {},
      repository: {},
    };
    next = () => Promise.resolve();
  });

  test("should set repository on context", async () => {
    // @ts-ignore
    await expect(repositoryMiddleware(Test)(ctx, next)).resolves.toBe(undefined);
    expect(ctx.repository.test).toStrictEqual(expect.any(Test));
    expect(ctx.metrics.repository).toStrictEqual(expect.any(Number));
  });

  test("should set repository with specific key", async () => {
    // @ts-ignore
    await expect(repositoryMiddleware(Test, { key: "otherKey" })(ctx, next)).resolves.toBe(undefined);
    expect(ctx.repository.otherKey).toStrictEqual(expect.any(Test));
    expect(ctx.metrics.repository).toStrictEqual(expect.any(Number));
  });
});
