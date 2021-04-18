import MockDate from "mockdate";
import { IMongoConnectionOptions, MongoConnection, MongoConnectionType } from "@lindorm-io/mongo";
import { mongoMiddleware } from "./mongo-middleware";
import { logger } from "../test";

MockDate.set("2020-01-01 08:00:00.000");

const next = jest.fn();

describe("mongoMiddleware", () => {
  let ctx: any;
  let inMemoryStore: Record<string, any>;
  let options: IMongoConnectionOptions;

  beforeEach(() => {
    inMemoryStore = { initialized: true };

    options = {
      type: MongoConnectionType.MEMORY,
      auth: {
        user: "user",
        password: "password",
      },
      url: {
        host: "host",
        port: 100,
      },
      databaseName: "databaseName",
      inMemoryStore,
    };

    ctx = { client: {}, logger, metrics: {} };
  });

  test("should set a mongo connection on context", async () => {
    await expect(mongoMiddleware(options)(ctx, next)).resolves.toBe(undefined);

    expect(ctx.client.mongo).toStrictEqual(expect.any(MongoConnection));

    const db = ctx.client.mongo.getDatabase();
    const collection = await db.collection("collectionName");
    await collection.createIndex({ index: "one" }, { options: "two" });

    expect(inMemoryStore).toMatchSnapshot();
  });
});
