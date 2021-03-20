import MockDate from "mockdate";
import { IMongoConnectionOptions, MongoConnection, MongoConnectionType } from "@lindorm-io/mongo";
import { IMongoMiddlewareContext } from "../types";
import { Logger, LogLevel } from "@lindorm-io/winston";
import { TObject, TPromise } from "@lindorm-io/core";
import { mongoMiddleware } from "./mongo-middleware";

MockDate.set("2020-01-01 08:00:00.000");

const logger = new Logger({ packageName: "n", packageVersion: "v", test: true });
logger.addConsole(LogLevel.ERROR);

describe("mongoMiddleware", () => {
  let inMemoryStore: TObject<any>;
  let options: IMongoConnectionOptions;
  let ctx: IMongoMiddlewareContext;
  let next: TPromise<void>;

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

    // @ts-ignore
    ctx = { logger };
    next = () => Promise.resolve();
  });

  test("should set a mongo connection on context", async () => {
    await expect(mongoMiddleware(options)(ctx, next)).resolves.toBe(undefined);

    expect(ctx.mongo).toStrictEqual(expect.any(MongoConnection));

    const db = ctx.mongo.getDatabase();
    const collection = await db.collection("collectionName");
    await collection.createIndex({ index: "one" }, { options: "two" });

    expect(inMemoryStore).toMatchSnapshot();
  });
});
