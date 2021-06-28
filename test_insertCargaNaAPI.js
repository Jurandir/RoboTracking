// teste rotina : "insertCargaNaAPI.js"

require('dotenv').config()

const insertCargaNaAPI = require('./controllers/atualizacoes/insertCargaNaAPI') 

let danfe = '35210605075152000843550010003295751105094417'

insertCargaNaAPI(danfe).then((ret)=>{
    console.log('RET:',ret)
})


// node test_insertCargaNaAPI