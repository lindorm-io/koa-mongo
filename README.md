# @lindorm-io/koa-mongo

## Installation
```shell script
npm install --save @lindorm-io/koa-mongo
```

### Peer Dependencies
This package has the following peer dependencies: 
* [@lindorm-io/global](https://www.npmjs.com/package/@lindorm-io/global)
* [@lindorm-io/mongo](https://www.npmjs.com/package/@lindorm-io/mongo)
* [@lindorm-io/winston](https://www.npmjs.com/package/@lindorm-io/winston)
* [koa](https://www.npmjs.com/package/koa)

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
