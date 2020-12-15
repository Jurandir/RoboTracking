const getImageAgileProcess = require('./services/getImageAgileProcess')
const fs =  require('fs')
const lista = require('./lista_nfs.json').lista
var doc,arq

const getIMG = (doc,arq) => {
      getImageAgileProcess(doc).then((ret)=>{
          if (!ret.Err) {
            console.log( 'OK:',ret.dados.json_response[0].client_formal_name )

            let base64Image  = ret.dados.json_response[0].checkpoint.resources[0].content
            
            fs.writeFile(arq, base64Image, {encoding: 'base64'}, function(err) {
              console.log('File created')
            })

            console.log('OK')
          } else {
              werr = doc+','+arq
              console.log('ERRO:',werr,ret.err)
          }
      })
}

let timeX = 0
lista.forEach(element => {
  doc = element.doc
  arq = element.arq
  setTimeout(getIMG,1000+timeX,doc,arq)
  timeX = timeX + 1500
})      
