const loadAPI   = require('./loadAPI')
const sendDebug = require('../helpers/sendDebug')

const method = 'POST'
const endpoint = '/User/Carga/Tracking/Ocorrencia/Danfe'
const server =  (process.env.NODE_ENV=='Production') ? process.env.URL_PRODUCAO : process.env.URL_TESTE

const enviaOcorrencias = async (params) => {

    sendDebug('[enviaOcorrencias]', `${method} : "${endpoint}" param:`+JSON.stringify(params) )
    return await loadAPI(method,endpoint,server,params)
}

module.exports = enviaOcorrencias


/* (RETURN)
dados:
{
    "success": true,
    "message": "string",
    "data": true,
    "code": 0
}
*/  
