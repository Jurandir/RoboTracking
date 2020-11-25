const getOcorrencias          = require('../loads/getOcorrencias')
const enviaOcorrencias        = require('../../services/enviaOcorrencias')
const sendLog                 = require('../../helpers/sendLog')


const checkEnviaOcorrencias = async (token) => {
    let ret   = { rowsAffected: 0, qtdeSucesso: 0,msg: '', isErr: false  }   

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

            let resposta     = await enviaOcorrencias( token, element )
            
            /*
            {
                "success": true,
                "message": "string",
                "data": true,
                "code": 0
            }
            */  

            try {
                isErr        = resposta.isErr
                isAxiosError = resposta.isAxiosError || false
                resultado    = resposta.dados.EvidenciaOcorrenciaResult
                gravaEnvio(element.DANFE)
            } catch (err) {
                isErr = true
                sendLog('WARNING',`Envio p/API-DOC:${element.DOCUMENTO} - (Sem Resposta)` )
            }

            if (isAxiosError==true) { 
                sendLog('ERRO',`Envio p/API-DOC:${element.DOCUMENTO} - (Axios ERRO)` ) 
            } else if ( resultado.Sucesso == false ) { 
                gravaEnvioResultado(element.DANFE), mensagem, 0)
                sendLog('WARNING',`Envio p/API-DOC: ${element.DOCUMENTO} - Ret API: ${resultado.Mensagem} - Prot: ${resultado.Protocolo}`)
            } else if ( resultado.Sucesso == true ) { 
                gravaEnvioResultado(element.DANFE), mensagem, 1)
                sendLog('SUCESSO',`Envio p/API-DOC: ${element.DOCUMENTO} - Ret API: ${resultado.Mensagem} - Prot: ${resultado.Protocolo}`)
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
