import { IKoaAppContext } from "@lindorm-io/koa";
import { MongoConnection, RepositoryBase } from "@lindorm-io/mongo";

export interface IKoaMongoContext extends IKoaAppContext {
  mongo: MongoConnection;
  repository: Record<string, RepositoryBase<any>>;
}
