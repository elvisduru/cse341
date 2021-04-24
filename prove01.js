const http = require("http");
const { handler } = require("./prove01-routes");

const server = http.createServer(handler);
server.listen(3000);
