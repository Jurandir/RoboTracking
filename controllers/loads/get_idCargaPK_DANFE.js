// get_idCargaPK_DANFE.js

const getCargaAPIitrack = require('./getCargaAPIitrack') 
const getNF_DANFE       = require('./getNF_DANFE')
const registraCargaNF   =  require('../atualizacoes/registraCargaNF') 

async function get_idCargaPK_DANFE(danfe) { 
    retorno = { success: false, idCargaPk: 0 , data: {}, api: true }

   let ret1 = await getNF_DANFE(danfe)
   if(ret1 && ret1.length>0) {
        if(ret1[0].IDCARGA>0) {
            retorno.api      = false
            retorno.success  = true
            retorno.idCargaPk = ret1[0].IDCARGA
            return retorno
        } 
   } else {
        retorno.success = false
        return retorno
   }

   let token = ret1[0].TOKEN

   let ret2 = await getCargaAPIitrack(token,danfe)

   if(ret2.success) {
        if (ret2.dados.success) {
            if(ret2.dados.data.count>0) {
                retorno.success   = true
                retorno.idCargaPk = ret2.dados.data.list[0].carga.idCargaPk
                retorno.data      = ret2.dados.data.list[0].carga
                registraCargaNF(danfe, retorno.idCargaPk, 'DANFE Localizada na API.')
                return retorno
            } else {
                registraCargaNF(danfe, 0, 'DANFE não Localizada na API.(1)')
                retorno.data   = ret2.dados.data
                return retorno
            }
        } else {
            console.log('ret2.DADOS erro:',ret2.dados)
            registraCargaNF(danfe, 0, 'DANFE não Localizada na API.(2)')
            retorno.data   = ret2.dados
            return retorno
        }
    } else {
        registraCargaNF(danfe, 0, `DANFE não Localizada na API.(${ret2.err})`)
        retorno.data   = ret2
        return retorno
    }
}

module.exports = get_idCargaPK_DANFE