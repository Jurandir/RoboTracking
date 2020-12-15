const getImageEasydocs = require('./services/getImageEasydocs')
const fs =  require('fs')
const lista = require('./lista_nfs.json').lista
var doc,arq

const getIMG = (doc,arq) => {
  emp = doc.substr(0,3)
  num = doc.substr(4,10)
  getImageEasydocs(emp,num).then((ret)=>{
          if (!ret.Err) {
            console.log( 'OK:',doc,ret.Retorno )

            if (ret.Retorno==true) {
                let base64Image  = ret.Imagem
                
                fs.writeFile(arq, base64Image, {encoding: 'base64'}, function(err) {
                  console.log('File created')
                })
          }

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
