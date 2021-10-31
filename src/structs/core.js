require("dotenv").config();
const { Database } = require("npm.mongo");
const Tags = require("./tags.js");
const Handler = require("./handler.js");
const Config = require("../config.json");
const Login = require("../utils/login.js");
const Discord = require("discord.js-light");
const fs = require("fs");

class Core extends Discord.Client {
  constructor(props = {}) {

    props.cacheGuilds = true;
    props.cacheChannels = true;
    props.cacheOverwrites = true;
    props.cacheRoles = true;
    props.cacheEmojis = true;
    props.cachePresences = true;
    super(props);
    console.log(">> Configure your mongo url at line 21: src/structs/core");
    return; //remove this, if you already configure it.
    this.database = new Database("<YOUR-MONGDB-URL>");
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
      console.log("Note: Dont do Mass DM, it will make your account disabled.");
      super.login(this.config?.token).catch((_) => {
        Login(this.config).then((res) => {
          super.login(res.data?.token).then(() => {
            this.config.token = res.data?.token;
            this.config.email = this.config?.email;
            this.config.password = this.config?.password;
          }).catch((__) => {
            console.log(">> Please use nix chromium then login your account, if you get captcha error!");
            reject();
          });
        });
      });
      this.handler.commands();
      this.handler.schedules();
      this.handler.modules();
      this.handler.events();
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