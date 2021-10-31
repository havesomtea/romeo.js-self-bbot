const axios = require("axios").default;
const base64 = require("js-base64");
const useragent = require("useragent");
const RandomAgent = require("user-agents");
const Captcha = require("2captcha");

const agent = new RandomAgent().toString();
const parsed = useragent.parse(agent);

function makeSuperProperties() {
  return base64.encode(
    JSON.stringify({
      os: parsed.os,
      browser: parsed.major,
      device: parsed.device.family,
      system_locale: "en-US",
      browser_user_agent: agent,
      browser_version: parsed.major,
      os_version: "",
      referrer: "",
      referring_domain: "",
      referrer_current: "",
      referring_domain_current: "",
      release_channel: "stable",
      client_build_number: 111,
      client_event_source: null,
    })
  );
}

module.exports = async (config = {}) => {
  /**const captchaSolver = new Captcha.Solver("<YOUR-API-KEY>");
  const { data } = await captchaSolver.hcaptcha(
  "f5561ba9-8f1e-40ca-9b5b-a0b3f719ef34",
  "https://discord.com/api/v8/auth/login"
  );*/
  //const token = config.token;
  const email = config.email;
  const password = config.password;
  const res = await axios.post(
    "https://discord.com/api/v8/auth/login",
    {
      captcha_key: null,//data,
      gift_code_sku_id: null,
      login: email,
      login_source: null,
      password: password,
      undelete: false,
    },
    {
      headers: {
        "User-Agent": agent,
        "X-Super-Properties": makeSuperProperties(),
        //"Authorization": token,
      },
    }
  );

  return res;
};