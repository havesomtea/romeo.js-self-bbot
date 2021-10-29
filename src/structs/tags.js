const Discord = require("discord.js-light");

class Tags {
  constructor(client) {
    this.client = client;
    this.collection = new Discord.Collection();
  }

  set(channelID, content) {
    if (!this.collection.has(channelID)) {
      this.collection.set(channelID, [content]);
    } else {
      this.collection.set(channelID, [...this.collection.get(channelID), content]);
    }
  }

  get(content) {
    return this.collection.get(content) || this.collection.find((x) => x.includes(content))
  }
}

module.exports = Tags;