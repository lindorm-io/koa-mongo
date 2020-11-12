import Joi from "@hapi/joi";
import MockDate from "mockdate";
import { EntityBase } from "@lindorm-io/core";
import { IMongoMiddlewareOptions, mongoMiddleware } from "./mongo-middleware";
import {
  IRepositoryOptions,
  MongoConnection,
  MongoConnectionType,
  RepositoryBase,
  TMongoDatabase,
} from "@lindorm-io/mongo";
import { Logger, LogLevel } from "@lindorm-io/winston";
import { MongoInMemoryDatabase } from "@lindorm-io/mongo/dist/class";

jest.mock("uuid", () => ({
  v4: () => "e397bc49-849e-4df6-a536-7b9fa3574ace",
}));

MockDate.set("2020-01-01 08:00:00.000");

class MockEntity extends EntityBase {
  public name: string;

  constructor(options: any) {
    super(options);
    this.name = options.name;
  }
}

class MockRepository extends RepositoryBase<MockEntity> {
  constructor(options: IRepositoryOptions) {
    super({
      collectionName: "MockRepository",
      db: options.db,
      logger: options.logger,
      indices: [{ index: { id: 1 }, options: { unique: true } }],
      schema: Joi.object({
        created: Joi.date().required(),
        id: Joi.string().guid().required(),
        name: Joi.string().required(),
        updated: Joi.date().required(),
        version: Joi.number().required(),
      }),
    });
  }

  protected createEntity(data: any): MockEntity {
    return new MockEntity(data);
  }

  protected getEntityJSON(entity: MockEntity): any {
    return {
      created: entity.created,
      id: entity.id,
      name: entity.name,
      updated: entity.updated,
      version: entity.version,
    };
  }
}

const logger = new Logger({ packageName: "n", packageVersion: "v" });
logger.addConsole(LogLevel.ERROR);

describe("mongoMiddleware", () => {
  let database: TMongoDatabase;
  let options: IMongoMiddlewareOptions;
  let ctx: any;
  let next: any;

  beforeEach(() => {
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
      databaseName: "name",
      databaseRef: (db) => {
        database = db;
      },
    };
    ctx = { logger };
    next = () => Promise.resolve();
  });

  test("should set a functional mongo on context", async () => {
    await expect(mongoMiddleware(options)(ctx, next)).resolves.toBe(undefined);

    expect(ctx.mongo).toStrictEqual(expect.any(MongoConnection));
    expect(database).toStrictEqual(expect.any(MongoInMemoryDatabase));

    const repo = new MockRepository({ db: database, logger });
    await repo.create(new MockEntity({ name: "name" }));
    await expect(repo.find({ name: "name" })).resolves.toMatchSnapshot();
  });
});
