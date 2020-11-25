const getOcorrencias          = require('../loads/getOcorrencias')
const enviaOcorrencias        = require('../../services/enviaOcorrencias')
const ocorrencia              = require('../../models/ocorrencia')
const sendLog                 = require('../../helpers/sendLog')

const checkEnviaOcorrencias = async (id,token) => {
    let ret   = { rowsAffected: 0, qtdeSucesso: 0,msg: '', isErr: false  }
    let envio = ocorrencia
    
    envio.token = token
    envio.content.idResponsavelFk = id

    function gravaEnvio(danfe) {
        let params = {
            danfe: danfe,
            reenvio: 1,
	        mensagem: '',
	        protocolo: '', 
	        sucesso: '0'
        }
        atualizaTracking(params)
    }

    function gravaEnvioResultado(danfe, mensagem, sucesso) {
        let params = {
            danfe: danfe,
            reenvio: 0,
	        mensagem: mensagem,
	        protocolo: '', 
	        sucesso: sucesso
        }
        atualizaTracking(params)
    }

    let dados = await getOcorrencias()

    if (dados.erro) {
        ret.isErr = true
        ret.msg   = JSON.stringify(dados.erro)
        sendLog('ERRO', ret.msg )
        return ret
    } 
    ret.rowsAffected = dados.length

    async function enviaTodos() {
        const promises = dados.map(async (element, idx) => {
            let resultado    = {Mensagem:'Sem resposta',Protocolo:'[IMAGEM]',Sucesso:false}
            let isErr        = true
            let isAxiosError = true
            
            envio.content.danfe             = element.DANFE
            envio.content.idCargaFk         = element.IDCARGA
            envio.content.dataOcorrencia    = element.DT_OCORRENCIA
            envio.content.idOcorrenciaPk    = element.ID_OCORRENCIA
            envio.content.descricao         = element.OBSERVACAO
            envio.content.idTrackingCliente = element.ID
            envio.content.nroNotaFiscal     = element.NRONOTAFISCAL

            let resposta     = await enviaOcorrencias( token, envio )
        
            try {
                isErr        = resposta.isErr
                isAxiosError = resposta.isAxiosError || false
                resultado    = resposta.dados
                gravaEnvio(element.DANFE)
            } catch (err) {
                isErr = true
                sendLog('WARNING',`Envio p/API-DOC:${element.DOCUMENTO} - (Sem Resposta)` )
            }

            if (isAxiosError==true) { 
                sendLog('ERRO',`Envio p/API-DOC:${element.DOCUMENTO} - (Axios ERRO)` ) 
            } else if ( resultado.success == false ) { 
                gravaEnvioResultado(element.DANFE, resultado.message, 0)
                sendLog('WARNING',`Envio p/API-DOC: ${element.DOCUMENTO} - Ret API: ${resultado.message} - Prot: ${resultado.code}`)
            } else if ( resultado.success == true ) { 
                gravaEnvioResultado(element.DANFE, resultado.message, 1)
                sendLog('SUCESSO',`Envio p/API-DOC: ${element.DOCUMENTO} - Ret API: ${resultado.message} - Prot: ${resultado.code}`)
            } else {
                sendLog('ALERTA',`Envio p/API-DOC: ${element.DOCUMENTO} - (Sem retorno)`)
            }

        })
        await Promise.all(promises)
    }

    await enviaTodos()
    return ret   

}

module.exports = checkEnviaOcorrencias
