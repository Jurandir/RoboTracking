const login        = require('../../models/login') 
const loadAPI      = require('../../services/loadAPI')

const url_teste    = process.env.URL_TESTE    || 'http://beta.martinlabs.com.br/iTrackServer-1.0-SNAPSHOT/ws'
const utl_producao = process.env.URL_PRODUCAO || 'https://www.itrackbrasil.com.br/ws'
const ambiente     = process.env.URL_PRODUCAO || 'Test'

const getToken = async () => {
    let servidor = (ambiente=='Producion') ? utl_producao : url_teste
    let ret = await loadAPI('POST','/User/Login',servidor,login ) 
    if (ret.isErr==false) {
        let success = ret.dados.success
        let id = -1
        let token = null
        if (success==true) {
           id = ret.dados.data.id
           token = ret.dados.data.token   
        }
        return { success: ret.dados.success,
                 id: id, 
                 token: token, 
                 err: null }
    } else {
        return { success: false, id: -1, token: null , err: ret.err}
    }
}

module.exports = getToken