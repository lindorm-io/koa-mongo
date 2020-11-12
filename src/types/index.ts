import { IKoaAppContext } from "@lindorm-io/koa";
import { IMongoConnectionOptions, MongoConnection, TMongoDatabase } from "@lindorm-io/mongo";

export interface IMongoMiddlewareOptions extends IMongoConnectionOptions {
  databaseRef?: (database: TMongoDatabase) => void;
}

export interface IMongoMiddlewareContext extends IKoaAppContext {
  mongo: MongoConnection;
}
