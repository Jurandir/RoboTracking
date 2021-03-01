// Envia registro de entrega para API

const loadAPI = require('./loadAPI')
const sendDebug = require('../helpers/sendDebug')
const entrega = require('../models/entrega')

require('dotenv').config()

const method = 'POST'
const endpoint = '/User/Carga/Entrega/Danfe'
const server =  (process.env.NODE_ENV=='Production') ? process.env.URL_PRODUCAO : process.env.URL_TESTE
const debug_base64 = process.env.DEBUG_MOSTRA_BASE64 || 'OFF'

const enviaEvidencias = async (token,element) => {

    let params = entrega(token,element)

    // sendDebug('[enviaEvidencias]', `${method} : "${endpoint}" param:`+JSON.stringify(params) )

    return await loadAPI(method,endpoint,server,params)

}

module.exports = enviaEvidencias

