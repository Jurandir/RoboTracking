// test_fecha_entrega_DANFE

const gravaRegistroEntrega   = require('./controllers/comprovantes/gravaRegistroEntrega')
const listaDANFEs            = require('./testes/listaDANFEs')
const getFechaEntregaDANFE   = require('./controllers/loads/getFechaEntregaDANFE')
const enviaEvidencias        = require('./services/enviaEvidencias')

require('dotenv').config()

const SEM_MAPA_DE_ENTREGA = false /// <<<============== Não Testa MAPA 

let ind = listaDANFEs.length;

( async () => {


    for await (let danfe of listaDANFEs) {
            getFechaEntregaDANFE(danfe,SEM_MAPA_DE_ENTREGA).then( (dados)=> {
                --ind
                console.log('DANFE:',danfe)
                console.log('DADOS:',dados)
                if(dados) {
                    let ind1 = ind
                    enviaEvidencias(dados.TOKEN,dados).then((ret)=>{
                        console.log('POST ../User/Carga/Entrega/Danfe:')
                        console.log(`(${ind1}) - DANFE:`,danfe)
                        console.log('Request:',ret.params)
                        console.log('Response:',ret.dados)
                        grava_response(ret,dados)
                    })
                } 
            })
    }

    console.log('....')
    // process.exit(0)
    
})()


function grava_response(ret_api,element) {
    function gravaFechaEntrega( danfe, enviado, protocolo ){
        let params = {
            danfe: danfe,
            enviado : enviado,  // 0-Pendente , 1- enviado , 2 - pronto para enviar
            protocolo: protocolo,
        }
        gravaRegistroEntrega(params)
    }    
    let msg1      = ''
    let msg2      = ''
    let resultado = ret_api.dados
   
    if ( resultado.success == true ) { 
        msg1 = resultado.message
        if (msg1==undefined) { msg1 = 'Success. OK.'}
        gravaFechaEntrega(element.DANFE, 2, msg1 )
        msg2 = `SUCESSO - Registro de entrega - DANFE: ${element.DANFE} - idCargaPK: ${element.IDCARGA} - Message: ${msg1} - Success: ${resultado.success}`
    } else {
        msg1 = resultado.message
        
        if(msg1 == 'Erro inesperado, tente novamente mais tarde') {
            gravaFechaEntrega(element.DANFE, 2, msg1 )
            msg2 = `AVISO - Registro de entrega - Finalizado - DANFE: ${element.DANFE} - idCargaPK: ${element.IDCARGA} - Message: ${resultado.message} - Message: ${resultado.message}`
        } else {
            resultado.message = resultado.message+', Err:'+resultado.code
            gravaFechaEntrega(element.DANFE, 0 , msg1 )
            msg2 = `WARNING - Registro de entrega - Message: "${resultado.message}" - DANFE: ${element.DANFE} - idCargaPK: ${element.IDCARGA} - Success: ${resultado.success}`    
        }
    } 
    console.log(msg2)
}

