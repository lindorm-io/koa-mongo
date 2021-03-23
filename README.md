# @lindorm-io/koa-mongo
Mongo Connection middleware for @lindorm-io/koa applications

## Installation
```shell script
npm install --save @lindorm-io/koa-mongo
```

### Peer Dependencies
This package has the following peer dependencies: 
* [@lindorm-io/koa](https://www.npmjs.com/package/@lindorm-io/koa)
* [@lindorm-io/mongo](https://www.npmjs.com/package/@lindorm-io/mongo)
* [@lindorm-io/winston](https://www.npmjs.com/package/@lindorm-io/winston)

## Usage

```typescript
koaApp.addMiddleware(mongoMiddleware({
  type: MongoConnectionType.STORAGE,
  auth: {
    user: "user",
    password: "password",
  },
  url: {
    host: "https://db/location/",
    port: 27000,
  },
  databaseName: "name",
}));
```
