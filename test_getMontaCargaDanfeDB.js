// teste rotina : "getMontaCargaDanfeDB.js"

require('dotenv').config()

const fs                   = require('fs')
const getMontaCargaDanfeDB = require('./controllers/loads/getMontaCargaDanfeDB')

let danfe = '35210601844555002711550500014457321919698708'

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