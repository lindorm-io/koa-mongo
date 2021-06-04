import MockDate from "mockdate";
import { MongoConnection, MongoConnectionType } from "@lindorm-io/mongo";
import { logger } from "../test";
import { mongoPoolMiddleware } from "./mongo-pool-middleware";

MockDate.set("2020-01-01T08:00:00.000Z");

const next = jest.fn();

describe("mongoPoolMiddleware", () => {
  let ctx: any;
  let inMemoryStore: Record<string, any>;
  let mongo: MongoConnection;

  beforeEach(async () => {
    inMemoryStore = { initialized: true };

    mongo = new MongoConnection({
      auth: { user: "user", password: "password" },
      databaseName: "databaseName",
      hostname: "host",
      inMemoryStore,
      port: 100,
      type: MongoConnectionType.MEMORY,
    });

    ctx = { client: {}, logger, metrics: {} };
  });

  test("should set a mongo connection on context", async () => {
    await mongo.connect();

    await expect(mongoPoolMiddleware(mongo)(ctx, next)).resolves.toBeUndefined();

    expect(ctx.client.mongo).toStrictEqual(expect.any(MongoConnection));

    const db = ctx.client.mongo.database();
    const collection = await db.collection("collectionName");
    await collection.createIndex({ index: "one" }, { options: "two" });

    expect(inMemoryStore).toMatchSnapshot();
  });

  test("should automatically connect", async () => {
    await expect(mongoPoolMiddleware(mongo)(ctx, next)).resolves.toBeUndefined();

    expect(ctx.client.mongo).toStrictEqual(expect.any(MongoConnection));

    const db = ctx.client.mongo.database();
    const collection = await db.collection("collectionName");
    await collection.createIndex({ index: "one" }, { options: "two" });

    expect(inMemoryStore).toMatchSnapshot();
  });
});
