const Core = require("./structs/core.js");
const client = new Core();

client.connect().then(() => {
  client.on("ready", async () => {
    console.log(`Logged as ${client.user.username} (${client.user.id})`);
    console.log(`Time: ${new Date().toTimeString()}`);
    (new (require("./structs/api.js"))(client));
  });
  
  client.on("message", async (message) => {
    if (message.author?.bot) return;
    const prefix = (await client.matchPrefix(message));
    if (prefix) {
      message.args = message.content.slice(prefix.length).trim().split(/ +/g);
      message.commandName = message.args.shift().toLowerCase();
    } else if (message.mentions.users.first()?.id === message.client.user.id) {
      message.args = message.content.trim().split(/ +/g);
      message.commandName = message.args.shift().toLowerCase();
    }
    
    const command = client.commands.get(message?.commandName) || client.commands.find((cmd) => cmd?.aliases?.includes(message?.commandName));

    if (command) {
      try {
        if (message.author?.id === message.client?.user?.id) {
          setTimeout(() => message.delete(), 500);
        }
        await command.execute(message);
      } catch (err) {
        console.log(`Command: ${command.name} - ${err.message}`);
      } finally {
        console.log(`Command: ${command.name} was ran by ${message.author.tag} ${!message?.guild ? "in DM's" : `in guild: ${message.guild?.name} (${message.guild?.id})`}`);
      }
    }
  });
}).catch(() => console.log("Incorrect Account Credential."));