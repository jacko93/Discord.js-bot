const Discord = require("discord.js");
const client = new Discord.Client();
const https = require("https");
const express = require("express");
const md5 = require("md5");
const uws = require("uws");
const youtubeKey = "***";
const secretWykop = "***";
const keyWykop = "***";
const imgurAuth = "***";

//Adds plus reaction to gifs and images

client.on("message", (message) => {
  if (message.content.includes("gfycat.com") || message.content.includes("imgur.com")
   || message.content.includes(".gif") || message.content.includes("i.reddit")
   || message.content.includes(".jpg") || message.content.includes(".png")) {
    message.react("359459661218316290");
  }
});

process.on("uncaughtException", (err) => {
  console.log(err);
});

//Imgur API
client.on("message", (message) => {

  let prefix = "!imgur ";
  let tag = message.content.replace(prefix, "");

  let options = {
    hostname: "api.imgur.com",
    path: "/3/gallery/t/" + tag + ".json",
    method: "GET",
    headers: { Authorization: imgurAuth }
  }

  if (message.content.startsWith(prefix)) {
    https.get(options, res => {
      res.setEncoding("utf8");
      let body = "";
      res.on("data", data => { body += data; });
      res.on("end", () => {
        body = JSON.parse(body);
        let random = Math.floor(Math.random() * body.data.items.length) + 1;
        message.channel.send(body.data.items[random].link)
      });
    });
  }
});

//Random picture from subreddit

client.on("message", (message) => {

  let prefix = "!reddit ";
  let subName = message.content.replace(prefix, "");
  let url = "https://www.reddit.com/r/" + subName + "/new.json?limit=100";
  let random = Math.floor(Math.random() * 99) + 1;

  if (message.content.startsWith(prefix + subName)) {
    https.get(url, res => {
      res.setEncoding("utf8");
      let body = "";
      res.on("data", data => { body += data; });
      res.on("end", () => {
        body = JSON.parse(body);
        if (body.error == "403") { message.channel.send("This subreddit is private! :("); }
        else { message.channel.send(body.data.children[random].data.url); }
        });
      });
    }
});


//Newest entry from submitted tag Wykop.pl
client.on ("message", (message) => {

  if (message.content.startsWith("#")) {
      let tag = message.content
        .replace("#", "")
        .replace(" ", "");
      let md = md5(secretWykop + "https://a.wykop.pl/tag/" + tag + "/appkey/" + keyWykop + ",format,json");
      let url = "/tag/" + tag + "/appkey/" + keyWykop + ",format,json";
      let options = {
        hostname: "a.wykop.pl",
        path: url,
        method: "GET",
        headers: { "apisign": md }
      }

  https.get(options, res => {
    res.setEncoding("utf8");
    let body = "";
    res.on("data", data => { body += data; });
    res.on("end", () => {
      body = JSON.parse(body);
      let text = body.items[0].body;
          text = text.replace(/(<([^>]+)>)/ig, "").replace(/<\/a>/g, "");
      if (body.items[0].embed != null) { message.channel.send("Autor:  " + body.items[0].author + "\n\n" + text + "\n\n" + body.items[0].embed.url); }
      else { message.channel.send("Autor:  " + body.items[0].author + "\n\n" + text); }
    });
  });
  }
});

//First video of youtube search query
client.on("message", (message) => {
  let prefix = "!yt ";
  if (message.content.startsWith(prefix)) {
    let query = message.content.replace(prefix, "");
    let url = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + query + "&key=" + youtubeKey;

    https.get(url, res => {
      res.setEncoding("utf8");
      let body = "";
      res.on("data", data => { body += data; });
      res.on("end", () => {
        var z = 0;
        body = JSON.parse(body);
        while (body.items[z].id.videoId == null) { z++; }
        message.channel.send("https://www.youtube.com/watch?v=" + body.items[z].id.videoId);
      });
    });
  }
});

client.on("ready", () => {
  console.log("I am ready!");
});

client.login("***");
