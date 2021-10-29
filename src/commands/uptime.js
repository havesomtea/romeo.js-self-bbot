module.exports = {
  execute: (message) => {
    const uptime = (Date.now() / 1000 - message.client.uptime / 1000).toFixed(0);

    return message.channel.send(`Online since: <t:${uptime}:R>`)
  }
};