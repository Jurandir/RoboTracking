// teste rotina : "getMontaCargaDanfeDB.js"

require('dotenv').config()

const getMontaCargaDanfeDB = require('./controllers/loads/getMontaCargaDanfeDB')

let danfe = '25210629739737004280550010000251151144760316'

getMontaCargaDanfeDB(danfe).then((ret)=>{
    console.log(ret)
})
