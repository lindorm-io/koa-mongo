import { IKoaAppContext } from "@lindorm-io/koa";
import { MongoConnection, MongoInMemoryConnection } from "@lindorm-io/mongo";

export interface IMongoMiddlewareContext extends IKoaAppContext {
  mongo: MongoConnection | MongoInMemoryConnection;
}
