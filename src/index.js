import express from "express";

import bot from "./server.js";
import {Queue} from "./queue.js";

import join from "../events/event.join";
import left from "../events/event.left";

const app = express();
const queue = Queue();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/sendMessage", async (req, res) => {
  const { message } = req.body;
  try {
    queue.add({ id: "730796412", message: message });
    // await bot.sendMessage("", message);
    console.log("Enviando para a fila a menssagem: \n", message);
    res.status(200).json({ message: "ok" });
  } catch (error) {
    if (error) throw error;
  }
});

setInterval(async() => {
  await queue.process(bot);
}, 1000);

bot.on("text", (msg) => {
  console.log(msg);
  const text = msg.text;
  if (text.toLowerCase() === "oi") {
    bot.sendMessage(msg.chat.id, "oi");
    console.log("enviando oi");
  } else if (text.toLowerCase() === "tchau") {
    bot.sendMessage(msg.chat.id, "Até");
    console.log("enviando Até");
  } else {
    bot.sendMessage(msg.chat.id, "hmmm");
    console.log("enviando hmmm");
  }
});

bot.on("new_chat_members", join);
bot.on("left_chat_member", left);




app.listen(3333, () => {
  console.log("server running on localhost:3333");
});
