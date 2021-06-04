import MockDate from "mockdate";
import { MongoConnectionOptions, MongoConnection, MongoConnectionType } from "@lindorm-io/mongo";
import { mongoMiddleware } from "./mongo-middleware";
import { logger } from "../test";

MockDate.set("2020-01-01T08:00:00.000Z");

const next = jest.fn();

describe("mongoMiddleware", () => {
  let ctx: any;
  let inMemoryStore: Record<string, any>;
  let options: MongoConnectionOptions;

  beforeEach(() => {
    inMemoryStore = { initialized: true };

    options = {
      auth: { user: "user", password: "password" },
      databaseName: "databaseName",
      hostname: "host",
      inMemoryStore,
      port: 100,
      type: MongoConnectionType.MEMORY,
    };

    ctx = { client: {}, logger, metrics: {} };
  });

  test("should set a mongo connection on context", async () => {
    await expect(mongoMiddleware(options)(ctx, next)).resolves.toBeUndefined();

    expect(ctx.client.mongo).toStrictEqual(expect.any(MongoConnection));

    const db = ctx.client.mongo.database();
    const collection = await db.collection("collectionName");
    await collection.createIndex({ index: "one" }, { options: "two" });

    expect(inMemoryStore).toMatchSnapshot();
  });
});
