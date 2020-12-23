// Envia comprovante para API

const loadAPI     = require('./loadAPI')
const comprovante = require('../models/comprovante')

const method   = 'POST'
const endpoint = '/User/Carga/Comprovante/Base64'
const server   =  (process.env.NODE_ENV=='Production') ? process.env.URL_PRODUCAO : process.env.URL_TESTE

const enviaEvidenciasBase64 = async (token,element,imagem) => {

    let log    = `${method} : "${endpoint}" idCarga: ${element.IDCARGA}` 
    let params = comprovante(token, element, imagem, log)

    return await loadAPI(method,endpoint,server,params)
}

module.exports = enviaEvidenciasBase64
