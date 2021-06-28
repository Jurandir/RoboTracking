// teste rotina : "getMontaCargaDanfeDB.js"

require('dotenv').config()

const fs                   = require('fs')
const getMontaCargaDanfeDB = require('./controllers/loads/getMontaCargaDanfeDB')

let danfe = '28210604067040000101550010000702731161962117'

getMontaCargaDanfeDB(danfe).then((ret)=>{
    
    let file  = `./log/${danfe}.json`
    let linha = JSON.stringify( ret.data[0] , 0 , 2 )

    console.log(linha)

    fs.writeFile(file, linha,  function(err) {
       if (err) {
              console.error(err);
        }
    })    


})



// node test_getMontaCargaDanfeDB.js