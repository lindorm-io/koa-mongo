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

## Usage

```typescript
koaApp.addMiddleware(mongoMiddleware({
  user: "user",
  password: "password",
  host: "https://db/location/",
  port: 27000,
  name: "db-name",
}));
```
