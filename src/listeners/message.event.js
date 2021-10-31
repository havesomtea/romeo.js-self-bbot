module.exports = {
  execute: async (client,message) => {
    if (message.author?.bot) return;
    if (message?.channel?.type === "text" || message?.guild) {
      if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return console.log("I dont have permissions to send message");
    } else {
      console.log("someone messaging in your dm's")
    }

    const prefix = (await client.matchPrefix(message));
    if (prefix) {
      message.args = message.content.slice(prefix.length).trim().split(/ +/g);
      message.commandName = message.args.shift().toLowerCase();
    } else if (message.mentions.users.first()?.id === client.user?.id) {
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
  }
};