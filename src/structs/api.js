const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

class API {
  constructor(client) {
    this.client = client;
    this.server = express();
    this.server.set("port", 3000);
    this.server.set("query parser", "extended");
    this.server.set("trust proxy", 1);
    this.server.set("json spaces", 2);
    this.server.disable("x-powered-by");

    this.middlewares();
    this.routes();
    this.start();
  }

  middlewares() {
    this.server.use(express.urlencoded({ extended: false, limit: "5mb" }));
    this.server.use(express.json({ limit: "5mb" }));
    this.server.use(cors());
    this.server.use(helmet());
    this.server.use(express.static("public"));
  }

  routes() {
    this.server.get("/", (req, res) => res.status(200).json({
      id: this.client.user.id,
      username: this.client.user.username,
      count: {
        guild: this.client.guilds.cache.size,
        user: this.client.users.cache.size
      }
    }));
  }

  start() {
    this.server.listen(this.server.get("port"), () => {
      console.log("Started, listening at port: " + this.server.get("port"));
    });
  }
}

module.exports = API;
