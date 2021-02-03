const getOcorrencias          = require('../loads/getOcorrencias')
const enviaOcorrencias        = require('../../services/enviaOcorrencias')
const ocorrencia              = require('../../models/ocorrencia')
const sendLog                 = require('../../helpers/sendLog')
const atualizaTracking        = require('../atualizacoes/atualizaTracking')
const formata_tzOffset        = require('../../helpers/formata_tzOffset')

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
            let textErro     = ''
            
            envio.content.danfe             = element.DANFE
            envio.content.idCargaFk         = element.IDCARGA || 0
            envio.content.dataOcorrencia    = formata_tzOffset( element.DT_OCORRENCIA )
            envio.content.idOcorrenciaPk    = element.ID_OCORRENCIA
            envio.content.descricao         = element.OBSERVACAO
            envio.content.idTrackingCliente = element.ID
            envio.content.nroNotaFiscal     = element.NRONOTAFISCAL
            envio.token                     = element.TOKEN 
            envio.content.idResponsavelFk   = element.VALIDO


            let origem_msg = `( User:${element.CNPJ_USER}, ID:${element.VALIDO}, Ocorr:${element.ID_OCORRENCIA} )`
        

            let resposta     = await enviaOcorrencias( envio )
            
            try {
                isErr        = resposta.isErr
                isAxiosError = resposta.isAxiosError || false
                resultado    = resposta.dados
                gravaEnvio(element.DANFE)
            } catch (err) {
                isErr = true
                sendLog('ERRO',`Atualização de TRACKING:${element.DANFE} - ID:${ element.ID}. (${origem_msg})` )
            }

            if(!resultado){
                resultado = {}
                resultado.message = 'Erro !!!'
                resultado.success = false
            }

            resultado.message = (resultado.message) ? resultado.message : '.'

            if (isAxiosError==true) { 
                textErro = resposta.err.response.status+' - '+resposta.err.response.statusText
                sendLog('ERRO',`Envio TRACKING: ${element.DANFE} - (STATUS: "${textErro}" ) ID:${ element.ID} - API Carga: ${element.IDCARGA} (${origem_msg})` ) 
            } else if ( resultado.success == false ) { 
                gravaEnvioResultado(element.DANFE, resultado.message, 0)
                sendLog('WARNING',`Envio TRACKING: ${element.DANFE} - Ret API: ${resultado.message} - ID:${ element.ID} - API Carga: ${element.IDCARGA} (${origem_msg})`)
            } else if ( resultado.success == true ) { 
                gravaEnvioResultado(element.DANFE, resultado.message, 1)
                sendLog('SUCESSO',`Envio TRACKING: ${element.DANFE} - Ret API: ${resultado.message} - ID:${ element.ID} - API Carga: ${element.IDCARGA} (${origem_msg})`)
            } else {
                sendLog('ALERTA',`Envio TRACKING: ${element.DANFE} - (Sem retorno) - ID:${ element.ID} - API Carga: ${element.IDCARGA} (${origem_msg})`)
            }

        })
        await Promise.all(promises)
    }

    await enviaTodos()
    return ret   

}

module.exports = checkEnviaOcorrencias
