import { IKoaAppContext } from "@lindorm-io/koa";
import { MongoConnection } from "@lindorm-io/mongo";

export interface IMongoMiddlewareContext extends IKoaAppContext {
  mongo: MongoConnection;
}
