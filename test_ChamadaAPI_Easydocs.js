require('dotenv').config()

const easydocs = require('./controllers/comprovantes/checkImagemEasyDocs')

let documento = 'SPOE3195116'

easydocs(documento).then((ret)=>{
    console.log('msg:',ret.msg)
})
