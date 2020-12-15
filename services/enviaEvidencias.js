const loadAPI = require('./loadAPI')
const sendDebug = require('../helpers/sendDebug')
const entrega = require('../models/entrega')

const method = 'POST'
const endpoint = '/User/Carga/Entrega/Danfe'
const server =  (process.env.NODE_ENV=='Production') ? process.env.URL_PRODUCAO : process.env.URL_TESTE

const enviaEvidencias = async (token,element,imagem) => {

    let params = entrega(token,element,imagem)
    let len = 0

    try {
        len = `${imagem}`.length
    } catch (err) {
        len = -1
    }

    let params1 = entrega(token,element,`(STRING_ImagemBase64) LEN: ${len}`)

    sendDebug('[enviaEvidencias]', `${method} : "${endpoint}" param:`+JSON.stringify(params1) )

    return await loadAPI(method,endpoint,server,params)

}

module.exports = enviaEvidencias

