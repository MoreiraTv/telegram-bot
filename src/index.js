import express from "express";

import bot from "./server";

import join from "../events/event.join";
import left from "../events/event.left";

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

const Queue = () => {
  const data = [];
  const status = {
    on: false
  };

  const add = (value) => {
    data.unshift(value);
  };

  const remove = () => {
    if (data.length === 0) {
      return -1;
    }
    const value = data[data.length - 1];
    data.splice(data.length - 1, 1);
    return value;
  };

  const process = async () => {
    if(status.on == false){

    
    if (data.length > 0) {
      status.on = true;
      console.log("Size data: ", data.length);
      console.log(data);
      let x = data.length - 1;
      let z = x;
      for(0 <= x;;) {
        if(x < 0){
          break
        }
        if (z >= (x + 3)) {
          console.log("esperando 1,5s");
          await sleep(1500);
          z = x;
          console.log("z: ", z);
        } else {
          await sleep(300);
        }
        try {
          if (await bot.sendMessage(data[x].id, data[x].message)) {
          
            console.log(data[x].message);
            console.log(data);
            remove();
            x--;
          }
        } catch (error) {
          throw error;
        }
        
      }
    }else{
      return
    }
  }else{
    return
  }
    
  };

  const print = () => console.log(data);

  return {
    add,
    remove,
    print,
    process,
  };
};

const queue = Queue();


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
  await queue.process()
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
