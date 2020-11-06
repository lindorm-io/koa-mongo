import { MongoInMemoryConnection } from "@lindorm-io/mongo";
import { mongoInMemoryMiddleware } from "./mongo-in-memory-middleware";

const logger = {
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  verbose: jest.fn(),
  debug: jest.fn(),
  silly: jest.fn(),
};

describe("mongoInMemoryMiddleware", () => {
  let ctx: any;
  let next: any;

  beforeEach(() => {
    ctx = {
      logger,
      metrics: {},
    };
    next = () => Promise.resolve();
  });

  test("should set mongo on context", async () => {
    await expect(
      mongoInMemoryMiddleware(
        new MongoInMemoryConnection({
          user: "user",
          password: "password",
          host: "host",
          port: 999,
          name: "name",
        }),
      )(ctx, next),
    ).resolves.toBe(undefined);

    expect(ctx.mongo).toStrictEqual(expect.any(MongoInMemoryConnection));
  });
});
