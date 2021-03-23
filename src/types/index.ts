import { IKoaAppContext } from "@lindorm-io/koa";
import { MongoConnection } from "@lindorm-io/mongo";

export type TNext = () => Promise<void>

export interface IMongoMiddlewareContext extends IKoaAppContext {
  mongo: MongoConnection;
}
