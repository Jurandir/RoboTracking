// pegaIdCargaPK_API.js

const getCargaAPIitrack  = require('../loads/getCargaAPIitrack')
const registraCargaNF =  require('./registraCargaNF')

const pegaIdCargaPK_API = async (danfe) => {
    let msg       = 'Pesquisa. idCargaPK'
    let retorno = {
        success: false,
        message: `Retorno da API, não OK. , ${danfe}`,
        idCargaPk: 0,
        danfe: danfe,
        data: {},
        update: false
    }

    let ret = await getCargaAPIitrack(token,danfe)       
          
          if(retorno.success){
            msg             = `DANFE Localizada.`
            let ok          = await registraCargaNF(danfe, retorno.idCargaPk, msg)
            retorno.update  = (ok.rowsAffected>0)
            retorno.success = retorno.update
            retorno.message = `(DANFE localizada na API) - idCargaPK: ${retorno.idCargaPk}, Danfe: ${danfe}, OK.`
            return retorno
          } else {
            let retAPI = ret.dados.message
            retorno.message = `(Insert CARGA) - Retorno da API: "${retAPI}" , ${danfe}`
            // console.log('Não OK, "pegaIdCargaPK_API.js":',ret)
            return retorno
          }  

}

module.exports = pegaIdCargaPK_API