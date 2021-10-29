const { resolve, parse } = require("path");
const { sync } = require("glob");

class Handler {
  constructor(client) {
    this.client = client;
  }

  commands() {
    const Files = sync(resolve(`./src/commands/**/*.js`));
    if (!Files.length) {
      console.log("No command found: Make sure you have atleast 1 event in the event directory.");
      return;
    }

    Files.forEach((filepath) => {
      delete require.cache[require.resolve(filepath)];
      const { name } = parse(filepath);
      let command = require(filepath);
      command.name = command?.name ?? name;

      try {
        this.client.commands.set(command.name, command);
        console.log(`Loaded Command: ${command.name}`);
      } catch (err) {
        throw new Error(err);
      }
    });
  }
}

module.exports = Handler;