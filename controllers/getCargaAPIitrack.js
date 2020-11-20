const loadAPI = require('../services/loadAPI')
const querystring = require('querystring')

const method = 'GET'
const endpoint = '/User/CargaSimples'
const server =  (process.env.NODE_ENV=='Prodution') ? process.env.URL_PRODUCAO : process.env.URL_TESTE

const getCargaAPIitrack = async (token,cnpj,nroFiscal) => {

    let params = {
        token:  token ,
        cnpj: cnpj ,
        nroFiscal: nroFiscal
    }

    return await loadAPI(method,endpoint,server,params)

}

module.exports = getCargaAPIitrack