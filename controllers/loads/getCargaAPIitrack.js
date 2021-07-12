const loadAPI = require('../../services/loadAPI')

const method = 'GET'
const endpoint = '/User/CargaSimples'
const server =  (process.env.NODE_ENV=='Production') ? process.env.URL_PRODUCAO : process.env.URL_TESTE

const getCargaAPIitrack = async (token,danfe) => {

    let params = {
        token: token ,
        danfe: danfe,
    }

    // console.log('server:',server)
    
    return await loadAPI(method,endpoint,server,params)

}

module.exports = getCargaAPIitrack