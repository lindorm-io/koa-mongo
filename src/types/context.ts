import { KoaContext } from "@lindorm-io/koa";
import { MongoConnection, MongoRepository } from "@lindorm-io/mongo";

export interface MongoContext extends KoaContext {
  client: {
    mongo: MongoConnection;
  };
  repository: Record<string, MongoRepository<any>>;
}
