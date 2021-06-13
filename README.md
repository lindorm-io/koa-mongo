# @lindorm-io/koa-mongo
Mongo Connection middleware for @lindorm-io/koa applications

## Installation
```shell script
npm install --save @lindorm-io/koa-mongo
```

### Peer Dependencies
This package has the following peer dependencies: 
* [@lindorm-io/entity](https://www.npmjs.com/package/@lindorm-io/entity)
* [@lindorm-io/koa](https://www.npmjs.com/package/@lindorm-io/koa)
* [@lindorm-io/mongo](https://www.npmjs.com/package/@lindorm-io/mongo)
* [@lindorm-io/winston](https://www.npmjs.com/package/@lindorm-io/winston)

## Usage

### Client Middleware
```typescript
koaApp.addMiddleware(mongoMiddleware({
  auth: { user: "user", password: "password" },
  databaseName: "name",
  hostname: "db.location.com",
  port: 27000,
  type: MongoConnectionType.STORAGE,
}));

await ctx.client.mongo.connect();
```

### Repository Middleware
```typescript
koaApp.addMiddleware(repositoryMiddleware(YourRepositoryClass));

await ctx.repository.yourRepositoryClass.create(yourEntity);
```

### Entity Middleware
```typescript
koaApp.addMiddleware(repositoryEntityMiddleware("body.entityId", YourEntityClass, YourRepositoryClass));

ctx.entity.yourEntityClass.id // -> <uuid>
```
