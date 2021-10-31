
module.exports = async(client, schedule) => {
  client.on("ready", async () => {
    try {
      if (!(await client.database.get("count_message"))) client.database.set("count_message", 0);

      console.log("Start leveling... count: " + (await client.database.get("count_message")));
      schedule("leveling", "1m 5s", async () => {
        await client.database.set("count_message", (await client.database.get("count_message")) + 1);
        console.log("Message count: " + (await client.database.get("count_message")));
        const guild = client.guilds.cache.get(client.config?.message?.guild);
        const channel = guild?.channels.cache.get(client.config?.message?.channel);

        if (channel) {
          if ((await client.database.get("count_message")) === 1) {
            channel.send("uwu").then((message) => {
              setTimeout(() => message.delete(), 3000)
            }).catch(() => console.log("I dont have permissions to send content"));
          } else {
            channel.send(".").then((message) => {
              setTimeout(() => message.delete(), 200)
            }).catch(() => console.log("I dont have permissions to send content"));
          }
        }
      });
    } catch (err) {
      throw new Error(err);
    }
  })
}