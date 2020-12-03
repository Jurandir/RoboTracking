const loadAPI = require('./loadAPI')

const method = 'POST'
const endpoint = '/User/Carga/Tracking/Ocorrencia/Danfe'
const server =  (process.env.NODE_ENV=='Production') ? process.env.URL_PRODUCAO : process.env.URL_TESTE

const enviaOcorrencias = async (params) => {
    console.log('Rotina: enviaOcorrencias')
    console.log('method:',method)
    console.log('endpoint:',endpoint)
    console.log('server:',server)
    console.log('params:',params)
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
