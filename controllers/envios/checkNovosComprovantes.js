// Prepara comprovantes e envia para API

const easydocs                = require('../comprovantes/checkImagemEasyDocs')
const agileprocess            = require('../comprovantes/checkImagemAgileProcess')
const gravaRegistroEvidencias = require('../comprovantes/gravaRegistroEvidencias')
const getEvidencias           = require('../loads/getEvidencias')
const enviaEvidenciasBase64   = require('../../services/enviaEvidenciasBase64')
const sendLog                 = require('../../helpers/sendLog')

async function checkNovosComprovantes(token) {  
    let ret   = { rowsAffected: 0, qtdeSucesso: 0,msg: '', isErr: false  }   

    function gravaEvidenciasLoad_OK(danfe,origem){
        let params = {
            danfe: danfe,
            enviado: 0,
            origem: origem,
            load: 1,
            send: 0,
            protocolo: '',
        }
        gravaRegistroEvidencias(params)
    }
    function gravaEvidenciasSend_ERR( danfe, protocolo, origem ){
        let params = {
            danfe: danfe,
            enviado: 0,
            origem: origem,
            load: 0,
            send: 1,
            protocolo: protocolo,
        }
        gravaRegistroEvidencias(params)
    }

    function gravaEvidenciasSend_OK( danfe, protocolo, origem ){
        let params = {
            danfe: danfe,
            enviado: 1,
            origem: origem,
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
            let isErr        = false
            let origem       = 'EASYDOCS'

            evidencia = await easydocs(element.DOCUMENTO)
            
            if (evidencia.ok==false){
                origem       = 'AGILEPROCESS'
                evidencia    = await agileprocess(element.DOCUMENTO)
            } 

            if (evidencia.ok==false) {
                sendLog('WARNING',`(EasyDocs,AgileProcess) DOC:${element.DOCUMENTO} - (Não achou a imagem solicitada)` )
            } else
            if (evidencia.ok==true) {
                ret.qtdeSucesso++

                try {

                    let ret = await enviaEvidenciasBase64( token, element, evidencia.imagem )
                    let respostaBase64 = ret.dados
                             
                    if(!respostaBase64.message) {
                        respostaBase64.message = ` Origem ${origem}`
                    }

                    if(!respostaBase64.code) {
                        respostaBase64.code = 'Success'
                    }

                    if (!respostaBase64.success) {
                        respostaBase64.success = false
                    }

                    if ( respostaBase64.success == true ) { 
                            let aviso = respostaBase64.data[0] || 'OK'
                            respostaBase64.message = respostaBase64.message+', '+aviso
                            gravaEvidenciasSend_OK(element.DANFE, respostaBase64.code, origem)
                            sendLog('SUCESSO',`Envio IMAGEM - DANFE: ${element.DANFE} - API Carga: ${element.IDCARGA} - Message: ${respostaBase64.message} - Success: ${respostaBase64.success}`)
                    }  else {
                            respostaBase64.message = respostaBase64.message+', '+resultado.code
                            gravaEvidenciasSend_ERR(element.DANFE, respostaBase64.message , origem)
                            sendLog('WARNING',`Envio IMAGEM - DANFE: ${element.DANFE} - API Carga: ${element.IDCARGA} - Message: ${respostaBase64.message} - Success: ${respostaBase64.success}`)
                    }  

                    gravaEvidenciasLoad_OK(element.DANFE, origem)

                } catch (err) {
                    isErr = true
                    sendLog('ERRO',`UPD - EVIDÊNCIA - DOC: ${element.DOCUMENTO} - (${element.DANFE})` )
                    console.log('ERRO:',err)
                }    
            } 
        })
        await Promise.all(promises)
    }
    await getTodos()
    return ret   
}

module.exports = checkNovosComprovantes