const Discord = require("discord.js");
const client = new Discord.Client();
const https = require("https");
const youtubeKey = "AIzaSyDUtR5cQUZppxWisSd5Eevm_gUbH0TpdcI";


//Adds plus reaction to gifs and images

client.on("message", (message) => {
  // if (message.content.startsWith("https://gfycat.com") || message.content.startsWith("https://i.imgur.com")) {
    message.react("359459661218316290");
  });
// });

//Random picture from subreddit

client.on("message", (message) => {
  var prefix = "!reddit ";
  var subName = message.content.replace(prefix, "");
  var url = "https://www.reddit.com/r/" + subName + "/new.json?limit=100";
  var random = Math.floor(Math.random() * 99) + 1;
  if (message.content.startsWith(prefix + subName)) {
    https.get(url, res => {
      res.setEncoding("utf8");
      let body = "";
      res.on("data", data => { body += data; });
      res.on("end", () => {
        body = JSON.parse(body);
        JSON.stringify(body);
        message.channel.send(body.data.children[random].data.url);
        });
      });
  }
});

//First video of youtube search query

client.on("message", (message) => {
  var prefix = "!yt ";
  if (message.content.startsWith(prefix)) {
    var query = message.content.replace(prefix, "");
    var url = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + query + "&key=" + youtubeKey;

    https.get(url, res => {
      res.setEncoding("utf8");
      let body = "";
      res.on("data", data => { body += data; });
      res.on("end", () => {
        body = JSON.parse(body);
        JSON.stringify(body);
        message.channel.send("https://www.youtube.com/watch?v=" + body.items[0].id.videoId);
      });
    });
  }
});

client.on("ready", () => {
  console.log("I am ready!");
});

client.login("MzU4NzQ0MTY0NDQ5NjQ4NjQw.DJ86Hw.m3RWdco_XRaol2NwjNQlg23p47k");
