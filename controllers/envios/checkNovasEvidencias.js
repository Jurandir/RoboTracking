const easydocs                = require('../comprovantes/checkImagemEasyDocs')
const gravaRegistroEvidencias = require('../comprovantes/gravaRegistroEvidencias')
const getEvidencias           = require('../loads/getEvidencias')
const enviaEvidencias         = require('../../services/enviaEvidencias')
const sendLog                 = require('../../helpers/sendLog')

async function checkNovasEvidencias(token) {  
    let ret   = { rowsAffected: 0, qtdeSucesso: 0,msg: '', isErr: false  }   
    // let ultimo_doc

    function gravaEvidenciasLoad_OK(danfe){
        let params = {
            danfe: danfe,
            enviado: 0,
            origem: 'EASYDOCS',
            load: 1,
            send: 0,
            protocolo: '',
        }
        gravaRegistroEvidencias(params)
    }
    function gravaEvidenciasSend_OK( danfe, protocolo ){
        let params = {
            danfe: danfe,
            enviado: 1,
            origem: 'EASYDOCS',
            load: 0,
            send: 1,
            protocolo: protocolo,
        }
        gravaRegistroEvidencias(params)
    }

    let dados = await getEvidencias()
    
    if (dados.erro) {
        ret.isErr = true
        ret.msg   = JSON.stringify(dados.erro)
        sendLog('ERRO', ret.msg )
        return ret
    } 
    ret.rowsAffected = dados.length

    async function getTodos() {
        const promises = dados.map(async (element, idx) => {
            let resultado    = {Mensagem:'Sem resposta',Protocolo:'[IMAGEM]',Sucesso:false}
            let isErr        = true
            let isAxiosError = true
            let textErro     = ''

            evidencia = await easydocs(element.DOCUMENTO)

            if (evidencia.ok==false){
                sendLog('WARNING',`EasyDocs DOC:${element.DOCUMENTO} - (Não achou a imagem solicitada)` )
            } else
            if (evidencia.ok==true){
                ret.qtdeSucesso++
                let resposta     = await enviaEvidencias( token, element.IDCARGA, evidencia.imagem )
                try {
                    isErr        = resposta.isErr
                    isAxiosError = resposta.isAxiosError || false
                    resultado    = resposta.dados  //
                    gravaEvidenciasLoad_OK(element.DANFE)
                } catch (err) {
                    isErr = true
                    sendLog('ERRO',`UPD - EVIDÊNCIA - DOC: ${element.DOCUMENTO} - (${element.DANFE})` )
                }
    
                if (isAxiosError==true) { 
                    textErro = resposta.err.response.status+' - '+resposta.err.response.statusText
                    sendLog('AVISO',`Envio IMAGEM - DANFE: ${element.DANFE} - (STATUS: ${textErro})` ) 
                } else if ( resultado.success == false ) { 
                    sendLog('WARNING',`Envio IMAGEM - DANFE: ${element.DANFE} - API Carga: ${element.IDCARGA} - Message: ${resultado.message} - Success: ${resultado.success}`)
                } else if ( resultado.success == true ) { 
                    gravaEvidenciasSend_OK(element.DANFE, resultado.code)
                    sendLog('SUCESSO',`Envio IMAGEM - DANFE: ${element.DANFE} - API Carga: ${element.IDCARGA} - Message: ${resultado.message} - Success: ${resultado.success}`)
                } else {
                    sendLog('ALERTA',`Envio IMAGEM - DANFE: ${element.DANFE} - (Sem retorno)`)
                }
    
            } 
        })
        await Promise.all(promises)
    }
    await getTodos()
    return ret   
}

module.exports = checkNovasEvidencias