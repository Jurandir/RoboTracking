// teste rotina : "get_idCargaPK_DANFE.js"

require('dotenv').config()

const get_idCargaPK_DANFE = require('./controllers/loads/get_idCargaPK_DANFE') 

let danfe = '35210605075152000843550010003295751105094417'

get_idCargaPK_DANFE(danfe).then(ret1=>{

    console.log('RET:',ret1)

})

// node test_get_idCargaPK_DANFE