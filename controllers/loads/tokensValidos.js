const getTokensValidosDB = require('./getTokensValidosDB')
const getTokenAPI        = require('./getToken')
const sendLog            = require('../../helpers/sendLog')
const updateToken        = require('../atualizacoes/updateToken')

require('dotenv').config()
const node_env           = process.env.NODE_ENV        || 'Test'  // Production / Developer 

const tokensValidos = async () => {
    let TOKENS = []
    await getTokensValidosDB().then( async (dados) => {
        for await (let item of dados) {
            let user   = item.USUARIO
            let pwd    = item.SENHA
            let valido = item.VALIDO
            let token  = item.TOKEN
            let obj

            console.log('TOKEN > ',user,valido)

            if(valido===0) {
                    await getTokenAPI(user,pwd).then( async (ret)=>{
                        if ( (ret.err) && (!ret.token) ) {
                            sendLog('ERRO',`Obter Token - ${item.USUARIO} - Erro:(${ret.err}), Token:(${ret.token})`)
                        } else {

                            obj = {user: item.USUARIO, id: ret.id ,token: ret.token}
                            TOKENS.push(obj)

                            await updateToken(obj)

                            sendLog('INFO',`Sucesso - (${item.USUARIO}) habilitado, (${ret.id},${node_env})`)             
                        }
                    }).catch((err)=>{
                        sendLog('ERRO',`Obter Token - ${item.USUARIO} - Erro:(${err})`)
                        console.log('err',err)
                    })
            } else {
                obj    = {user: item.USUARIO, id: valido, token: token}
                TOKENS.push(obj)
                sendLog('INFO',`Token DB - (${item.USUARIO}) habilitado, (${obj.id},${node_env})`)             
            }        
        }
        global.TOKENS = TOKENS
    })
    return TOKENS
}

module.exports = tokensValidos
