const axios = require('axios')
const countReq = 10;
const reqs = []

for (let i = 1; i <= countReq; i++) {
    reqs.push(axios.post("http://localhost:3333/sendMessage", {
        // "id": "5516988674537",
        "message": `${i} \nOla!`
    }))
}

Promise.all(reqs)
    .then(res =>{
        console.log("sucesso");
        console.log(res);
    })
    .catch(err =>{
        console.log(err);
    })

