import { mongoMiddleware } from "./mongo-middleware";

jest.mock("@lindorm-io/mongo", () => ({
  MongoConnection: class MongoConnection {
    constructor() {}
    connect() {}
    disconnect() {}
  },
}));

const logger = {
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  verbose: jest.fn(),
  debug: jest.fn(),
  silly: jest.fn(),
};

describe("mongo-middleware.ts", () => {
  let options: any;
  let ctx: any;
  let next: any;

  beforeEach(() => {
    options = {
      user: "user",
      password: "password",
      host: "host",
      port: 100,
      name: "name",
    };
    ctx = {
      logger,
      metrics: {},
    };
    next = () => Promise.resolve();
  });

  test("should set mongo on context", async () => {
    await expect(mongoMiddleware(options)(ctx, next)).resolves.toBe(undefined);

    expect(ctx.mongo).toStrictEqual(expect.any(Object));
  });
});
