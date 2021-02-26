const fs                      = require('fs')
const checkImagemAgileProcess = require('./controllers/comprovantes/checkImagemAgileProcess')

let documento = "SPOE3145894"

checkImagemAgileProcess(documento).then((ret)=>{
    console.log('Len:',ret.imagem.length)
    let a = 1
    let fileName    = `Img_${a}`
    let base64Str   =  `${ret.imagem}`

    console.log(`resposta:`,ret.resposta)

    console.log(`Imagem (${fileName}.png), LEN:`,base64Str.length)

    let path        ='./'
    let arq         = `${path}/${fileName}.png`
    let buff        = new Buffer.from(base64Str, 'base64')
    fs.writeFileSync(arq , buff)
            
    
})
