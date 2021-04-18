import { repositoryMiddleware } from "./repository-middleware";
import { logger } from "../test";

class Test {}

describe("repositoryMiddleware", () => {
  let ctx: any;
  let next: any;

  beforeEach(() => {
    ctx = {
      logger,
      metrics: {},
      mongo: { getDatabase: () => "db" },
      repository: {},
    };
    next = () => Promise.resolve();
  });

  test("should set repository on context", async () => {
    // @ts-ignore
    await expect(repositoryMiddleware(Test)(ctx, next)).resolves.toBe(undefined);
    expect(ctx.repository).toMatchSnapshot();
    expect(ctx.metrics.repository).toStrictEqual(expect.any(Number));
  });

  test("should set repository with specific key", async () => {
    // @ts-ignore
    await expect(repositoryMiddleware(Test, { key: "otherKey" })(ctx, next)).resolves.toBe(undefined);
    expect(ctx.repository).toMatchSnapshot();
    expect(ctx.metrics.repository).toStrictEqual(expect.any(Number));
  });
});
