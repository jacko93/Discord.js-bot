const Discord = require("discord.js");
const client = new Discord.Client();
const https = require("https");
const express = require("express");
const md5 = require("md5");
const youtubeKey = "**********";

//Adds plus reaction to gifs and images

client.on("message", (message) => {
  if (message.content.includes("gfycat.com") || message.content.includes("imgur.com")) {
    message.react("359459661218316290");
  }
});

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
        if (body.error == "403") {
        message.channel.send("This subreddit is private! :(");
        } else {
        message.channel.send(body.data.children[random].data.url);
      }
        });
      });
    }
});


//Wykop.pl API
client.on ("message", (message) => {
  if (message.content.startsWith("#")) {
      var tag = message.content
        .replace("#", "")
        .replace(" ", "");
      let md = md5("********" + "https://a.wykop.pl/tag/" + tag + "/appkey/******,format,json");
      let url = '/tag/' + tag + '/appkey/********,format,json';
      let options = {
        hostname: 'a.wykop.pl',
        path: url,
        method: 'GET',
        headers: {
          "apisign": md
        }
      }
  https.get(options, res => {
    res.setEncoding("utf8");
    let body = "";
    res.on("data", data => { body += data; });
    res.on("end", () => {
      body = JSON.parse(body);
      JSON.stringify(body);
      if (body.items[0] == null || body.items[0].url == null) {
        message.channel.send("Nie ma nowych wpisów :(");
      } else if (body.items[0].embed.url == null) {
        message.channel.send(body.items[0].body);
      } else {
        message.channel.send(body.items[0].embed.url);
      }
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
        var z = 0;
        body = JSON.parse(body);
        JSON.stringify(body);
        while (body.items[z].id.videoId == null) { z++; }
        message.channel.send("https://www.youtube.com/watch?v=" + body.items[z].id.videoId);
      });
    });
  }
});

client.on("ready", () => {
  console.log("I am ready!");
});

client.login("*******");
