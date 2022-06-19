import { sleep } from "./utils/sleep";

export const Queue = () => {
  const data = [];
  const historyData = [];
  const status = {
    processing: false
  };

  const add = (value) => {
    value.timestamp = Math.floor(new Date() / 1000);
    value.processed = false;
    value.error = false;
    data.unshift(value);
  };

  const remove = () => {
    if (data.length === 0) {
      return -1;
    }
    const value = data[data.length - 1];
    historyData.unshift(value);
    data.splice(data.length - 1, 1);
    return value;
  };

  const process = async (bot) => {
    if(status.processing == false){

      if (data.length > 0) {
      console.log("========Historico da fila=============");
      console.table(historyData);
      console.log("\n");
      status.processing = true;
      console.log("Size data: ", data.length);
      console.log(data);
      let x = data.length - 1;
      let z = x;
      for(0 <= x;;) {
        if(x < 0){
          status.processing = false;
          break
        }
        if (z >= (x + 3)) {
          console.log("esperando 700ms");
          await sleep(700);
          z = x;
          console.log("z: ", z);
        } else {
          await sleep(300);
        }
        try {
          if (await bot.sendMessage(data[x].id, data[x].message)) {
          
            data[x].processed = true;
            console.log(data[x]);
            // console.log(data);
            remove();
            x--;
          }
        } catch (error) {
          data[x].error = true;
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
