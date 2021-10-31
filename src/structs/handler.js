const { resolve, parse } = require("path");
const { sync } = require("glob");
const mongodash = require("mongodash");

class Handler {
  constructor(client) {
    this.client = client;
  }

  commands() {
    const Files = sync(resolve(`./src/commands/**/*.js`));
    if (!Files.length) {
      return;
    }

    Files.forEach((filepath) => {
      try {
        delete require.cache[require.resolve(filepath)];
        const { name } = parse(filepath);
        let command = require(filepath);
        command.name = command?.name ?? name;

        console.log(`Loaded Command: ${command.name}`);
        this.client.commands.set(command.name, command);
      } catch (err) {
        throw new Error(err);
      }
    });
  }

  
  events() {
    const Files = sync(resolve(`./src/listeners/**/*.event.js`));
    if (!Files.length) {
      return;
    }

    Files.forEach((filepath) => {
      try {
        delete require.cache[require.resolve(filepath)];
        const { name } = parse(filepath);
        let event = require(filepath);
        event.name = event?.name ?? name?.replace(".event", "");

        console.log(`Loaded Event: ${event.name}`);
        this.client.on(event.name, (...args) => event.execute(this.client, ...args));
      } catch (err) {
        throw new Error(err);
      }
    });
  }

  modules() {
    const Files = sync(resolve(`./src/listeners/**/*.module.js`));
    if (!Files.length) {
      return;
    }

    Files.forEach((filepath) => {
      try {
        delete require.cache[require.resolve(filepath)];
        const { name } = parse(filepath);
        console.log(`Loaded Module: ${name.replace(".module", "")}`);
        require(filepath)(this.client);
      } catch (err) {
        throw new Error(err);
      }
    });
  }

  schedules() {
    const Files = sync(resolve(`./src/listeners/**/*.schedule.js`));
    if (!Files.length) {
      return;
    }

    (async () => {
      console.log(">> Configure your mongo url at line 80: src/structs/handler");
      return; //remove this, if you already configure it.
      await mongodash.init({
          uri: "<YOUR-MONGODB-URL>"
      });
      Files.forEach((filepath) => {
        try {
          delete require.cache[require.resolve(filepath)];
          const { name } = parse(filepath);
          console.log(`Loaded Schedule: ${name.replace(".schedule", "")}`);
          require(filepath)(this.client,mongodash.cronTask);
        } catch (err) {
          throw new Error(err);
        }
      });
    })()
  }
}

module.exports = Handler;