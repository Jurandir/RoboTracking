// Monta estrutura JSON para envio do comprovante 

const sendDebug = require('../helpers/sendDebug')

const comprovante = (token, dados, imageBase64, log) => {
    const ret = { 
        content: {
            idCarga: dados.IDCARGA,
            fotosComprovante: []
          },
        token: token
    }

    ret.content.fotosComprovante.push( { extensao: "PNG", imageBase64: imageBase64 })

    sendDebug('[enviaComprovante]', log )

    return ret
}

module.exports = comprovante