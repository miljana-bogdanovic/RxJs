const jsonServer = require("json-server");
const server = jsonServer.create();
const _ = require("lodash");
const router = jsonServer.router("../../database.json");
//const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3000;

server.use(router);
server.listen(port);
