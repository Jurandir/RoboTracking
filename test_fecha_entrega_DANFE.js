const gravaRegistroEntrega   = require('./controllers/comprovantes/gravaRegistroEntrega')
const listaDANFEs            = require('./testes/listaDANFEs')
const getFechaEntregaDANFE   = require('./controllers/loads/getFechaEntregaDANFE')
const enviaEvidencias        = require('./services/enviaEvidencias')

require('dotenv').config()

let ind = listaDANFEs.length;

( async () => {


    for await (let danfe of listaDANFEs) {
            getFechaEntregaDANFE(danfe).then( (dados)=> {
                --ind
                if(dados) {
                    let ind1 = ind
                    enviaEvidencias(dados.TOKEN,dados).then((ret)=>{
                        console.log('DADOS:')
                        console.log(`(${ind1} ) - DANFE:`,danfe,'Retorno:',ret,dados)
                        grava_response(ret,dados)
                    })
                } 
            })

    }
    
})()


function grava_response(resultado,element) {
    function gravaFechaEntrega( danfe, enviado, protocolo ){
        let params = {
            danfe: danfe,
            enviado : enviado,  // 0-Pendente , 1- enviado , 2 - pronto para enviar
            protocolo: protocolo,
        }
        gravaRegistroEntrega(params)
    }    
    let msg1 = ''
    let msg2 = ''
   
    if ( resultado.success == true ) { 
        msg1 = resultado.dados.message
        gravaFechaEntrega(element.DANFE, 2, msg1 )
        msg2 = `SUCESSO - Registro de entrega - DANFE: ${element.DANFE} - API Carga: ${element.IDCARGA} - Message: ${msg1} - Success: ${resultado.dados.success}`
    } else {
        msg1 = resultado.dados.message
        gravaFechaEntrega(element.DANFE, 0 , msg1)
        msg2 = `WARNING - Registro de entrega - DANFE: ${element.DANFE} - API Carga: ${element.IDCARGA} - Message: ${msg1} - Success: ${resultado.dados.success}`
    } 
    console.log(msg2)
}

