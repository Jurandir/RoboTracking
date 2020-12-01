const getImageAgileProcess = require('./services/getImageAgileProcess')
const fs =  require('fs')
var doc = 'SPOE2971067'


getImageAgileProcess(doc).then((ret)=>{
    if (!ret.Err) {
       console.log( ret.dados.json_response[0].client_formal_name )

       let base64Image  = ret.dados.json_response[0].checkpoint.resources[0].content
       
       fs.writeFile('img_'+doc+'.png', base64Image, {encoding: 'base64'}, function(err) {
         console.log('File created')
       })

       console.log('OK')
    } else {
        console.log('ERRO:',ret.err.toJSON().message)
    }
})

