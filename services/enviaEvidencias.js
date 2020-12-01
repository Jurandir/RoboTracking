const loadAPI = require('./loadAPI')
const entrega = require('../models/entrega')

const method = 'POST'
const endpoint = '/User/Carga/Entrega/Danfe'
const server =  (process.env.NODE_ENV=='Production') ? process.env.URL_PRODUCAO : process.env.URL_TESTE

const enviaEvidencias = async (token,element,imagem) => {

    let params = entrega(token,element,imagem)

    return await loadAPI(method,endpoint,server,params)

}

module.exports = enviaEvidencias

