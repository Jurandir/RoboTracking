const login        = require('../models/login')
const loadAPI      = require('../services/loadAPI')
const url_teste    = process.env.URL_TESTE    || 'http://beta.martinlabs.com.br/iTrackServer-1.0-SNAPSHOT/ws'
const utl_producao = process.env.URL_PRODUCAO || 'https://www.itrackbrasil.com.br/ws'
const ambiente     = process.env.URL_PRODUCAO || 'Test'

const getToken = async () => {
    let servidor = (ambiente=='Producion') ? utl_producao : url_teste
    let dados = await loadAPI('POST','/User/Login',servidor,login ) 
    if (dados.isErr==false) {
        return { token: dados.data.token, err: null }
    } else {
        return { token: null , err: dados.err}
    }
}

module.exports = getToken