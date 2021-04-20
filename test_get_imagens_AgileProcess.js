const fs                      = require('fs')
const checkImagemAgileProcess = require('./controllers/comprovantes/checkImagemAgileProcess')

// SPO-E-3138456

// SPOE3195116
// SPOE3205337
// SPOE3205646
// SPOE3205052

let documento = "SPOE3205337"

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
