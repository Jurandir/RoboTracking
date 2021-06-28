// insertCargaNaAPI.js

const insertNewCarga  = require('../envios/insertNewCarga')
const registraCargaNF =  require('../atualizacoes/registraCargaNF')

const insertCargaNaAPI = async (danfe) => {
    let msg       = 'Insert via Robô.'
    let retorno = {
        success: false,
        message: 'Retorno da API, não OK.',
        code: 0,
        idCargaPk: 0,
        danfe: danfe,
        data: {},
        update: false
    }

    let ret = await insertNewCarga(danfe)

    if(ret.success) {
        retorno.data      = ret.dados
        retorno.success   = ret.dados.success
        retorno.idCargaPk = ret.dados.data
  
        if(retorno.success) {

            let ok          = await registraCargaNF(danfe, retorno.idCargaPk, msg)
            retorno.update  = (ok.rowsAffected>0)
            retorno.message = `(Inclusão CARGA) - idCargaPK: ${retorno.idCargaPk}, Danfe: ${danfe}, OK.`
            return retorno             

        } else {
          
          retorno.code = ret.dados.code
          if(retorno.code==39){
            msg             = `DANFE Localizada. Code:${retorno.code}`
            let ok          = await registraCargaNF(danfe, retorno.idCargaPk, msg)
            retorno.update  = (ok.rowsAffected>0)
            retorno.success = retorno.update
            retorno.message = `(DANFE localizada na API) - idCargaPK: ${retorno.idCargaPk}, Danfe: ${danfe}, OK.`
            return retorno
          } else {
            return retorno
          }  

        }
    } else {
        retorno.data    = ret
        retorno.message = `API Falhou, Retorno: ${ret.err} , URL: ${ret.url}, Danfe:${danfe}`
        return retorno
    }
}

module.exports = insertCargaNaAPI