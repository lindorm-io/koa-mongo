import { IKoaAppContext } from "@lindorm-io/koa";
import { MongoConnection, MongoRepository } from "@lindorm-io/mongo";

export interface IKoaMongoContext extends IKoaAppContext {
  client: {
    mongo: MongoConnection;
  };
  repository: Record<string, MongoRepository>;
}
