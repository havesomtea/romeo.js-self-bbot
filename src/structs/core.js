require("dotenv").config();
const Tags = require("./tags.js");
const Handler = require("./handler.js");
const Config = require("../config.json");
const Login = require("../utils/login.js");
const Discord = require("discord.js-light");

class Core extends Discord.Client {
  constructor(props = {}) {

    props.cacheGuilds = true;
    props.cacheChannels = true;
    props.cacheOverwrites = true;
    props.cacheRoles = true;
    props.cacheEmojis = true;
    props.cachePresences = true;
    super(props);

    this.commands = new Discord.Collection();
    this.handler = new Handler(this);
    this.tags = new Tags(this);
    this.config = Config;
  }

  delay(ms = 3000) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async connect() {
    return new Promise((resolve, reject) => {
      super.login(this.config?.token).catch((_) => {
        Login(this.config).then((res) => {
          super.login(res.data?.token).then(() => {
            this.config.token = res.data?.token;
            this.config.email = this.config?.email;
            this.config.password = this.config?.password;
          }).catch((__) => {
            reject();
          });
        });
      });
      
      this.handler.commands();
      resolve();
    });
  }

  matchPrefix(message) {
    const prefix = this.config?.prefix;
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`^(${prefix ? `${escapeRegex(prefix)}|` : ""}<@!?${message.client.user.id}>|${escapeRegex(message.client.user.username.toLowerCase())})`, "i", "(s+)?");

    const matched = message.content.toLowerCase().match(regex);
    return (matched && matched.length && matched[0]);
  }
};

module.exports = Core;