// Verificas se existe entregas realizadas e envia para API

const gravaRegistroEntrega    = require('../comprovantes/gravaRegistroEntrega')
const getFechaEntrega         = require('../loads/getFechaEntrega')
const enviaEvidencias         = require('../../services/enviaEvidencias')
const sendLog                 = require('../../helpers/sendLog')

async function checkNovasEvidencias(token) {  
    let ret   = { rowsAffected: 0, qtdeSucesso: 0,msg: '', isErr: false  }   

    function gravaFechaEntrega( danfe, enviado, protocolo ){
        let params = {
            danfe: danfe,
            enviado : enviado,  // 0-Pendente , 1- enviado , 2 - pronto para enviar
            protocolo: protocolo,
        }
        gravaRegistroEntrega(params)
    }

    let dados = await getFechaEntrega()
  
    if (dados.erro) {
        ret.isErr = true
        ret.msg   = JSON.stringify(dados.erro)
        sendLog('ERRO', ret.msg )
        return ret
    } 
    ret.rowsAffected = dados.length

    async function getTodos() {
        const promises = dados.map(async (element, idx) => {
            let isErr        = false
            let resultado    = {Mensagem:'Sem resposta',Protocolo:'Entrega',Sucesso:false, success: false}
            
            let resposta     = await enviaEvidencias( token, element )

            try {
                resultado    = resposta.dados 
                isErr        = resposta.isErr

                if (!resultado.success) { 
                    resultado.success = false
                }

                if(!resultado.code){
                    resultado.code = '00'
                }

                if(!resultado.message){
                    resultado.message = 'Entrega'
                }

                if ( resultado.success == true ) { 
                    resultado.message = resultado.message+', Cod:'+resultado.code
                    gravaFechaEntrega(element.DANFE, 2, resultado.message )
                    sendLog('SUCESSO',`Registro de entrega - DANFE: ${element.DANFE} - API Carga: ${element.IDCARGA} - Message: ${resultado.message} - Success: ${resultado.success}`)
                } else {
                    resultado.message = resultado.message+', Err:'+resultado.code
                    gravaFechaEntrega(element.DANFE, 0 , resultado.message)
                    sendLog('WARNING',`Registro de entrega - DANFE: ${element.DANFE} - API Carga: ${element.IDCARGA} - Message: ${resultado.message} - Success: ${resultado.success}`)
                } 

            } catch (err) {
                    isErr = true
                    sendLog('ERRO',`UPD - EVIDÊNCIA - DOC: ${element.DOCUMENTO} - (${element.DANFE})` )
                    console.log('ERRO:',err)
            }    
             
        })

        await Promise.all(promises)
    }
    await getTodos()
    return ret   
}

module.exports = checkNovasEvidencias